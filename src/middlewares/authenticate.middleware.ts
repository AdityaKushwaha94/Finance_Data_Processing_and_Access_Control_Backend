import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "../constants/roles";
import { IUserRepository } from "../repositories/interfaces/user-repository.interface";
import { ApiError } from "../utils/api-error";

interface DecodedToken extends jwt.JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export const createAuthenticateMiddleware = (
  userRepository: IUserRepository
): RequestHandler => {
  return async (req, _res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Authorization token is missing");
      }

      const token = authHeader.substring("Bearer ".length);
      const decoded = jwt.verify(token, env.JWT_SECRET);

      if (typeof decoded === "string" || !decoded.sub) {
        throw new ApiError(401, "Invalid token payload");
      }

      const parsedPayload = decoded as DecodedToken;
      const user = await userRepository.findById(parsedPayload.sub);

      if (!user) {
        throw new ApiError(401, "User linked to token does not exist");
      }

      if (!user.isActive) {
        throw new ApiError(403, "User account is inactive");
      }

      req.authUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      };

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new ApiError(401, "Invalid or expired authorization token"));
        return;
      }

      next(error);
    }
  };
};
