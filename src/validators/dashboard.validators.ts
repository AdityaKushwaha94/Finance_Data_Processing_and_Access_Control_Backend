import { z } from "zod";

export const dashboardQuerySchema = {
  query: z
    .object({
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      months: z.coerce.number().int().min(1).max(24).default(6),
      recentLimit: z.coerce.number().int().min(1).max(20).default(5)
    })
    .refine(
      (query) =>
        !(query.startDate && query.endDate) || query.startDate <= query.endDate,
      {
        message: "startDate must be less than or equal to endDate",
        path: ["startDate"]
      }
    )
};
