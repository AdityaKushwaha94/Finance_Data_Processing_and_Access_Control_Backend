import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGO_URI: z
    .string()
    .min(1)
    .default("mongodb://127.0.0.1:27017/finance_dashboard_db"),
  JWT_SECRET: z
    .string()
    .min(16)
    .default("from env file,  i am going to overwrite this in the production system if required"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  SEED_ADMIN_EMAIL: z.string().email().default("admin@finance.local"),
  SEED_ADMIN_PASSWORD: z.string().min(8).default("Admin@12345")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  throw new Error("Environment validation failed");
}

export const env = parsed.data;
