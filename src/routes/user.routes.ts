import { RequestHandler, Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorize } from "../middlewares/authorize.middleware";
import { validate } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import {
  createUserSchema,
  updateUserRoleSchema,
  updateUserStatusSchema
} from "../validators/user.validators";

interface UserRouteDependencies {
  controller: UserController;
  authenticate: RequestHandler;
}

export const createUserRoutes = ({
  controller,
  authenticate
}: UserRouteDependencies): Router => {
  const router = Router();

  router.use(authenticate);
  router.use(authorize("admin"));

  router.post("/", validate(createUserSchema), asyncHandler(controller.createUser));
  router.get("/", asyncHandler(controller.listUsers));
  router.patch(
    "/:id/role",
    validate(updateUserRoleSchema),
    asyncHandler(controller.updateUserRole)
  );
  router.patch(
    "/:id/status",
    validate(updateUserStatusSchema),
    asyncHandler(controller.updateUserStatus)
  );

  return router;
};
