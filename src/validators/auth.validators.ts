import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must not exceed 64 characters");

export const registerSchema = {
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().email(),
    password: passwordSchema
  })
};

export const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
};
