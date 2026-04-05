import { Types } from "mongoose";
import {
  FinancialRecordDocument,
  FinancialRecordModel,
  IFinancialRecord
} from "../models/financial-record.model";
import {
  CategoryTotal,
  DashboardSummary,
  FinancialRecordFilters,
  IFinancialRecordRepository,
  MonthlyTrend,
  PaginatedResult,
  PaginationOptions
} from "./interfaces/financial-record-repository.interface";

export class FinancialRecordRepository implements IFinancialRecordRepository {
  public async create(input: {
    amount: number;
    type: "income" | "expense";
    category: string;
    date: Date;
    notes?: string;
    createdBy: string;
  }): Promise<FinancialRecordDocument> {
    return FinancialRecordModel.create({
      ...input,
      createdBy: new Types.ObjectId(input.createdBy)
    });
  }

  public async findById(id: string): Promise<FinancialRecordDocument | null> {
    return FinancialRecordModel.findById(id);
  }

  public async findAll(
    filters: FinancialRecordFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<FinancialRecordDocument>> {
    const match = this.buildMatchQuery(filters);
    const skip = (pagination.page - 1) * pagination.limit;

    const [data, total] = await Promise.all([
      FinancialRecordModel.find(match)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(pagination.limit),
      FinancialRecordModel.countDocuments(match)
    ]);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: total === 0 ? 0 : Math.ceil(total / pagination.limit)
    };
  }

  public async updateById(
    id: string,
    updates: Partial<{
      amount: number;
      type: "income" | "expense";
      category: string;
      date: Date;
      notes?: string;
    }>
  ): Promise<FinancialRecordDocument | null> {
    return FinancialRecordModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
  }

  public async deleteById(id: string): Promise<boolean> {
    const deleted = await FinancialRecordModel.findByIdAndDelete(id);
    return Boolean(deleted);
  }

  public async getSummary(
    filters: FinancialRecordFilters
  ): Promise<DashboardSummary> {
    const match = this.buildMatchQuery(filters);

    const [result] = await FinancialRecordModel.aggregate<{
      totalIncome: number;
      totalExpenses: number;
    }>([
      { $match: match },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
            }
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
            }
          }
        }
      }
    ]);

    const totalIncome = result?.totalIncome ?? 0;
    const totalExpenses = result?.totalExpenses ?? 0;

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses
    };
  }

  public async getCategoryTotals(
    filters: FinancialRecordFilters
  ): Promise<CategoryTotal[]> {
    const match = this.buildMatchQuery(filters);

    return FinancialRecordModel.aggregate<CategoryTotal>([
      { $match: match },
      {
        $group: {
          _id: "$category",
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          income: 1,
          expense: 1,
          net: { $subtract: ["$income", "$expense"] }
        }
      },
      { $sort: { category: 1 } }
    ]);
  }

  public async getMonthlyTrends(
    months: number,
    filters: FinancialRecordFilters
  ): Promise<MonthlyTrend[]> {
    const match = this.buildMatchQuery(filters);
    const trendStartDate = new Date();
    trendStartDate.setMonth(trendStartDate.getMonth() - (months - 1));
    trendStartDate.setDate(1);
    trendStartDate.setHours(0, 0, 0, 0);

    const dateFilter: { $gte?: Date; $lte?: Date } =
      (match.date as { $gte?: Date; $lte?: Date }) ?? {};

    if (!dateFilter.$gte || dateFilter.$gte < trendStartDate) {
      dateFilter.$gte = trendStartDate;
    }

    match.date = dateFilter;

    return FinancialRecordModel.aggregate<MonthlyTrend>([
      { $match: match },
      {
        $group: {
          _id: {
            period: {
              $dateToString: { format: "%Y-%m", date: "$date" }
            }
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          period: "$_id.period",
          income: 1,
          expense: 1,
          net: { $subtract: ["$income", "$expense"] }
        }
      },
      { $sort: { period: 1 } }
    ]);
  }

  public async getRecentActivity(
    limit: number,
    filters: FinancialRecordFilters
  ): Promise<FinancialRecordDocument[]> {
    const match = this.buildMatchQuery(filters);

    return FinancialRecordModel.find(match)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit);
  }

  private buildMatchQuery(
    filters: FinancialRecordFilters
  ): MatchQuery {
    const match: MatchQuery = {};

    if (filters.type) {
      match.type = filters.type;
    }

    if (filters.category) {
      match.category = filters.category;
    }

    if (filters.startDate || filters.endDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {};

      if (filters.startDate) {
        dateFilter.$gte = filters.startDate;
      }

      if (filters.endDate) {
        dateFilter.$lte = filters.endDate;
      }

      match.date = dateFilter;
    }

    return match;
  }
}

interface MatchQuery {
  type?: IFinancialRecord["type"];
  category?: string;
  date?: {
    $gte?: Date;
    $lte?: Date;
  };
}
