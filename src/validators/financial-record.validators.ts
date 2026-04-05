import { z } from "zod";
import { RECORD_TYPES } from "../models/financial-record.model";
import { objectIdSchema } from "./common.validators";

const financialRecordBaseSchema = z.object({
  amount: z.coerce.number().positive(),
  type: z.enum(RECORD_TYPES),
  category: z.string().trim().min(2).max(100),
  date: z.coerce.date(),
  notes: z.string().trim().max(500).optional()
});

export const createFinancialRecordSchema = {
  body: financialRecordBaseSchema
};

export const updateFinancialRecordSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: financialRecordBaseSchema
    .partial()
    .refine((payload) => Object.keys(payload).length > 0, {
      message: "At least one field is required for update"
    })
};

export const recordIdParamSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const listFinancialRecordsSchema = {
  query: z
    .object({
      type: z.enum(RECORD_TYPES).optional(),
      category: z.string().trim().min(2).max(100).optional(),
      search: z.string().trim().min(1).max(100).optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(10)
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
