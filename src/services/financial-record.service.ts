import {
  FinancialRecordFilters,
  IFinancialRecordRepository,
  PaginatedResult
} from "../repositories/interfaces/financial-record-repository.interface";
import {
  FinancialRecordDocument,
  RecordType
} from "../models/financial-record.model";
import { ApiError } from "../utils/api-error";

export interface CreateFinancialRecordInput {
  amount: number;
  type: RecordType;
  category: string;
  date: Date;
  notes?: string;
  createdBy: string;
}

export interface UpdateFinancialRecordInput {
  amount?: number;
  type?: RecordType;
  category?: string;
  date?: Date;
  notes?: string;
}

export class FinancialRecordService {
  constructor(private readonly recordRepository: IFinancialRecordRepository) {}

  public async createRecord(
    input: CreateFinancialRecordInput
  ): Promise<FinancialRecordDocument> {
    return this.recordRepository.create(input);
  }

  public async listRecords(
    filters: FinancialRecordFilters,
    page: number,
    limit: number
  ): Promise<PaginatedResult<FinancialRecordDocument>> {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));

    return this.recordRepository.findAll(filters, {
      page: safePage,
      limit: safeLimit
    });
  }

  public async getRecordById(id: string): Promise<FinancialRecordDocument> {
    const record = await this.recordRepository.findById(id);

    if (!record) {
      throw new ApiError(404, "Financial record not found");
    }

    return record;
  }

  public async updateRecord(
    id: string,
    updates: UpdateFinancialRecordInput
  ): Promise<FinancialRecordDocument> {
    const updatedRecord = await this.recordRepository.updateById(id, updates);

    if (!updatedRecord) {
      throw new ApiError(404, "Financial record not found");
    }

    return updatedRecord;
  }

  public async deleteRecord(id: string): Promise<void> {
    const wasDeleted = await this.recordRepository.deleteById(id);

    if (!wasDeleted) {
      throw new ApiError(404, "Financial record not found");
    }
  }

  public async restoreRecord(id: string): Promise<void> {
    const wasRestored = await this.recordRepository.restoreById(id);

    if (!wasRestored) {
      throw new ApiError(404, "Financial record not found or not deleted");
    }
  }
}
