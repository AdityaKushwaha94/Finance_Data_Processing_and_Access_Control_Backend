import { RequestHandler } from "express";
import { ZodTypeAny } from "zod";
import { ApiError } from "../utils/api-error";

interface ValidationSchema {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

const parseOrThrow = (
  schema: ZodTypeAny,
  value: unknown,
  label: "body" | "query" | "params"
): unknown => {
  const parsed = schema.safeParse(value);

  if (!parsed.success) {
    throw new ApiError(400, `Invalid request ${label}`, parsed.error.flatten());
  }

  return parsed.data;
};

export const validate = (schema: ValidationSchema): RequestHandler => {
  return (req, _res, next) => {
    try {
      if (schema.body) {
        req.body = parseOrThrow(schema.body, req.body, "body");
      }

      if (schema.query) {
        req.query = parseOrThrow(schema.query, req.query, "query") as typeof req.query;
      }

      if (schema.params) {
        req.params = parseOrThrow(schema.params, req.params, "params") as typeof req.params;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
