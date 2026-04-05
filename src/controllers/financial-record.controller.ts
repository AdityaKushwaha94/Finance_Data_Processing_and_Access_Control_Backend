import { Request, Response } from "express";
import { FinancialRecordService } from "../services/financial-record.service";
import { RecordType } from "../models/financial-record.model";

interface ListRecordsQuery {
  type?: RecordType;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
}

export class FinancialRecordController {
  constructor(private readonly recordService: FinancialRecordService) {}

  public createRecord = async (req: Request, res: Response): Promise<void> => {
    const record = await this.recordService.createRecord({
      ...req.body,
      createdBy: req.authUser!.id
    });

    res.status(201).json({
      success: true,
      message: "Financial record created successfully",
      data: record
    });
  };

  public listRecords = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as ListRecordsQuery;

    const result = await this.recordService.listRecords(
      {
        type: query.type,
        category: query.category,
        startDate: query.startDate,
        endDate: query.endDate
      },
      query.page,
      query.limit
    );

    res.status(200).json({
      success: true,
      data: result
    });
  };

  public getRecordById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const record = await this.recordService.getRecordById(id);

    res.status(200).json({
      success: true,
      data: record
    });
  };

  public updateRecord = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const record = await this.recordService.updateRecord(id, req.body);

    res.status(200).json({
      success: true,
      message: "Financial record updated successfully",
      data: record
    });
  };

  public deleteRecord = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    await this.recordService.deleteRecord(id);

    res.status(200).json({
      success: true,
      message: "Financial record deleted successfully"
    });
  };
}
