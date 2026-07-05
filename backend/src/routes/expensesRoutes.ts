import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
} from "../controllers/expensesControllers.js";

const router = Router(); //creating mini express app for this specific route

// get all expenses of a user (api) backend /server
// route definition: fn which listens to api requests

// GET ALL
router.get("/", getAllExpenses);

// anything which comes after the / + : is route param ( can be extracted as req.params)
// GET SINGLE
router.get("/:id", getExpenseById);

// CREATE NEW
router.post("", createExpense);

// UPDATE
router.put("/:id", updateExpense);

// DELETE
router.delete("/:id", deleteExpense);

export default router;
