import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

interface DashboardQuery {
  startDate?: Date;
  endDate?: Date;
  months?: number;
  recentLimit?: number;
}

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  public getOverview = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as DashboardQuery;

    const data = await this.dashboardService.getOverview({
      startDate: query.startDate,
      endDate: query.endDate,
      months: query.months,
      recentLimit: query.recentLimit
    });

    res.status(200).json({
      success: true,
      data
    });
  };
}
