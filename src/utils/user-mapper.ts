import { UserDocument } from "../models/user.model";
import { PublicUser } from "../types/user.types";

export const toPublicUser = (user: UserDocument): PublicUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};
