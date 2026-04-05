import { RequestHandler, Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authorize } from "../middlewares/authorize.middleware";
import { validate } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import { dashboardQuerySchema } from "../validators/dashboard.validators";

interface DashboardRouteDependencies {
  controller: DashboardController;
  authenticate: RequestHandler;
}

export const createDashboardRoutes = ({
  controller,
  authenticate
}: DashboardRouteDependencies): Router => {
  const router = Router();

  router.use(authenticate);

  router.get(
    "/overview",
    authorize("viewer", "analyst", "admin"),
    validate(dashboardQuerySchema),
    asyncHandler(controller.getOverview)
  );

  return router;
};
