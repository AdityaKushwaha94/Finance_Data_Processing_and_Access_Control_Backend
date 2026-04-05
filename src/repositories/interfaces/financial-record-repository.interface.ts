import {
  FinancialRecordDocument,
  RecordType
} from "../../models/financial-record.model";

export interface FinancialRecordFilters {
  type?: RecordType;
  category?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

export interface CategoryTotal {
  category: string;
  income: number;
  expense: number;
  net: number;
}

export interface MonthlyTrend {
  period: string;
  income: number;
  expense: number;
  net: number;
}

export interface IFinancialRecordRepository {
  create(input: {
    amount: number;
    type: RecordType;
    category: string;
    date: Date;
    notes?: string;
    createdBy: string;
  }): Promise<FinancialRecordDocument>;
  findById(id: string): Promise<FinancialRecordDocument | null>;
  findAll(
    filters: FinancialRecordFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<FinancialRecordDocument>>;
  updateById(
    id: string,
    updates: Partial<{
      amount: number;
      type: RecordType;
      category: string;
      date: Date;
      notes?: string;
    }>
  ): Promise<FinancialRecordDocument | null>;
  deleteById(id: string): Promise<boolean>;
  restoreById(id: string): Promise<boolean>;
  getSummary(filters: FinancialRecordFilters): Promise<DashboardSummary>;
  getCategoryTotals(filters: FinancialRecordFilters): Promise<CategoryTotal[]>;
  getMonthlyTrends(
    months: number,
    filters: FinancialRecordFilters
  ): Promise<MonthlyTrend[]>;
  getRecentActivity(
    limit: number,
    filters: FinancialRecordFilters
  ): Promise<FinancialRecordDocument[]>;
}
