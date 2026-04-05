import {
  CategoryTotal,
  DashboardSummary,
  FinancialRecordFilters,
  IFinancialRecordRepository,
  MonthlyTrend
} from "../repositories/interfaces/financial-record-repository.interface";
import { FinancialRecordDocument } from "../models/financial-record.model";

export interface DashboardInput {
  startDate?: Date;
  endDate?: Date;
  months?: number;
  recentLimit?: number;
}

export interface DashboardOutput {
  summary: DashboardSummary;
  categoryTotals: CategoryTotal[];
  trends: MonthlyTrend[];
  recentActivity: FinancialRecordDocument[];
}

export class DashboardService {
  constructor(private readonly recordRepository: IFinancialRecordRepository) {}

  public async getOverview(input: DashboardInput): Promise<DashboardOutput> {
    const filters: FinancialRecordFilters = {
      startDate: input.startDate,
      endDate: input.endDate
    };

    const months = Math.min(24, Math.max(1, input.months ?? 6));
    const recentLimit = Math.min(20, Math.max(1, input.recentLimit ?? 5));

    const [summary, categoryTotals, trends, recentActivity] = await Promise.all([
      this.recordRepository.getSummary(filters),
      this.recordRepository.getCategoryTotals(filters),
      this.recordRepository.getMonthlyTrends(months, filters),
      this.recordRepository.getRecentActivity(recentLimit, filters)
    ]);

    return {
      summary,
      categoryTotals,
      trends,
      recentActivity
    };
  }
}
