import { RequestHandler, Router } from "express";
import { FinancialRecordController } from "../controllers/financial-record.controller";
import { authorize } from "../middlewares/authorize.middleware";
import { validate } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/async-handler";
import {
  createFinancialRecordSchema,
  listFinancialRecordsSchema,
  recordIdParamSchema,
  updateFinancialRecordSchema
} from "../validators/financial-record.validators";

interface FinancialRecordRouteDependencies {
  controller: FinancialRecordController;
  authenticate: RequestHandler;
}

export const createFinancialRecordRoutes = ({
  controller,
  authenticate
}: FinancialRecordRouteDependencies): Router => {
  const router = Router();

  router.use(authenticate);

  router.get(
    "/",
    authorize("analyst", "admin"),
    validate(listFinancialRecordsSchema),
    asyncHandler(controller.listRecords)
  );

  router.get(
    "/:id",
    authorize("analyst", "admin"),
    validate(recordIdParamSchema),
    asyncHandler(controller.getRecordById)
  );

  router.post(
    "/",
    authorize("admin"),
    validate(createFinancialRecordSchema),
    asyncHandler(controller.createRecord)
  );

  router.patch(
    "/:id",
    authorize("admin"),
    validate(updateFinancialRecordSchema),
    asyncHandler(controller.updateRecord)
  );

  router.delete(
    "/:id",
    authorize("admin"),
    validate(recordIdParamSchema),
    asyncHandler(controller.deleteRecord)
  );

  router.patch(
    "/:id/restore",
    authorize("admin"),
    validate(recordIdParamSchema),
    asyncHandler(controller.restoreRecord)
  );

  return router;
};
