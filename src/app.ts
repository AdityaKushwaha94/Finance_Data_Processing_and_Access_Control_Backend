import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { container } from "./container";
import {
  errorHandler,
  notFoundHandler
} from "./middlewares/error-handler.middleware";
import { createAuthRoutes } from "./routes/auth.routes";
import { createDashboardRoutes } from "./routes/dashboard.routes";
import { createFinancialRecordRoutes } from "./routes/financial-record.routes";
import { createUserRoutes } from "./routes/user.routes";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Finance dashboard backend is running"
  });
});

app.use(
  "/api/auth",
  createAuthRoutes({
    controller: container.controllers.authController,
    authenticate: container.middlewares.authenticate
  })
);

app.use(
  "/api/users",
  createUserRoutes({
    controller: container.controllers.userController,
    authenticate: container.middlewares.authenticate
  })
);

app.use(
  "/api/records",
  createFinancialRecordRoutes({
    controller: container.controllers.financialRecordController,
    authenticate: container.middlewares.authenticate
  })
);

app.use(
  "/api/dashboard",
  createDashboardRoutes({
    controller: container.controllers.dashboardController,
    authenticate: container.middlewares.authenticate
  })
);

app.use(notFoundHandler);
app.use(errorHandler);
