import { z } from "zod";
import { ROLES } from "../constants/roles";
import { objectIdSchema } from "./common.validators";

export const createUserSchema = {
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().email(),
    password: z.string().min(8).max(64),
    role: z.enum(ROLES),
    isActive: z.boolean().optional()
  })
};

export const userIdParamSchema = {
  params: z.object({
    id: objectIdSchema
  })
};

export const updateUserRoleSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    role: z.enum(ROLES)
  })
};

export const updateUserStatusSchema = {
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    isActive: z.boolean()
  })
};
