import { ErrorRequestHandler, RequestHandler } from "express";
import { env } from "../config/env";
import { ApiError } from "../utils/api-error";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details
    });
    return;
  }

  if (isDuplicateKeyError(error)) {
    res.status(409).json({
      success: false,
      message: "Duplicate value conflict"
    });
    return;
  }

  if (isMongooseCastError(error)) {
    res.status(400).json({
      success: false,
      message: "Invalid identifier format"
    });
    return;
  }

  const message = error instanceof Error ? error.message : "Internal server error";

  res.status(500).json({
    success: false,
    message: "Internal server error",
    details: env.NODE_ENV === "development" ? message : undefined
  });
};

const isDuplicateKeyError = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  return (error as { code?: number }).code === 11000;
};

const isMongooseCastError = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  return (error as { name?: string }).name === "CastError";
};
