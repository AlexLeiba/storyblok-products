import { Router } from "express";
import {
  getExpensesByCategories,
  getMonthlyTotalsOfOneYear,
  getDashboardStats,
  getSpendingTrends,
} from "../controllers/analyticsControllers";

// route definitions
const router = Router();

router.get("/categories", getExpensesByCategories);
router.get("/monthly", getMonthlyTotalsOfOneYear);
router.get("/dashboard", getDashboardStats);
router.get("/trends", getSpendingTrends);

export default router;
