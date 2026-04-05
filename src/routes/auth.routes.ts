import { RequestHandler, Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/async-handler";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validators";

interface AuthRouteDependencies {
  controller: AuthController;
  authenticate: RequestHandler;
}

export const createAuthRoutes = ({
  controller,
  authenticate
}: AuthRouteDependencies): Router => {
  const router = Router();

  router.post("/register", validate(registerSchema), asyncHandler(controller.register));
  router.post("/login", validate(loginSchema), asyncHandler(controller.login));
  router.get("/me", authenticate, asyncHandler(controller.me));

  return router;
};
