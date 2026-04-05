import { RequestHandler } from "express";
import { Role } from "../constants/roles";
import { ApiError } from "../utils/api-error";

export const authorize = (...allowedRoles: Role[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.authUser) {
      next(new ApiError(401, "Unauthorized"));
      return;
    }

    if (!allowedRoles.includes(req.authUser.role)) {
      next(new ApiError(403, "Forbidden: you do not have access to this resource"));
      return;
    }

    next();
  };
};
