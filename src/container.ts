import { AuthController } from "./controllers/auth.controller";
import { DashboardController } from "./controllers/dashboard.controller";
import { FinancialRecordController } from "./controllers/financial-record.controller";
import { UserController } from "./controllers/user.controller";
import { createAuthenticateMiddleware } from "./middlewares/authenticate.middleware";
import { FinancialRecordRepository } from "./repositories/financial-record.repository";
import { UserRepository } from "./repositories/user.repository";
import { AuthService } from "./services/auth.service";
import { DashboardService } from "./services/dashboard.service";
import { FinancialRecordService } from "./services/financial-record.service";
import { BcryptPasswordService } from "./services/password.service";
import { UserService } from "./services/user.service";

const userRepository = new UserRepository();
const financialRecordRepository = new FinancialRecordRepository();
const passwordService = new BcryptPasswordService();

const authService = new AuthService(userRepository, passwordService);
const userService = new UserService(userRepository, passwordService);
const financialRecordService = new FinancialRecordService(financialRecordRepository);
const dashboardService = new DashboardService(financialRecordRepository);

const authController = new AuthController(authService);
const userController = new UserController(userService);
const financialRecordController = new FinancialRecordController(financialRecordService);
const dashboardController = new DashboardController(dashboardService);

const authenticate = createAuthenticateMiddleware(userRepository);

export const container = {
  repositories: {
    userRepository,
    financialRecordRepository
  },
  services: {
    authService,
    userService,
    financialRecordService,
    dashboardService
  },
  controllers: {
    authController,
    userController,
    financialRecordController,
    dashboardController
  },
  middlewares: {
    authenticate
  }
};
