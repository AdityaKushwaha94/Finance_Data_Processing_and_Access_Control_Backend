import mongoose from "mongoose";
import { env } from "./env";

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.MONGO_URI);
  console.log("MongoDB connected successfully");
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};
