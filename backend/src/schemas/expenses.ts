import * as zod from "zod";
import { ExpenseCategory, ExpenseSort } from "../types";

export const createExpenseSchema = zod.object({
  amount: zod.coerce
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(10000000000),
  category: zod.enum(ExpenseCategory),
  description: zod
    .string()
    .trim()
    .min(3, "Description must be at least 3 character")
    .max(200),
  date: zod.coerce.date().optional(),
});

export const updateExpenseSchema = zod.object({
  amount: zod.coerce
    .number()
    .min(0.01, "Amount must be greater than 0")
    .optional(),
  category: zod.enum(ExpenseCategory).optional(),
  description: zod
    .string()
    .trim()
    .min(3, "Description must be at least 1 character")
    .max(200)
    .optional(),
  date: zod.coerce.date().optional(),
});

export const getAllExpensesQuerySchema = zod.object({
  category: zod.enum(ExpenseCategory).optional(),
  sort: zod.enum(ExpenseSort).optional(),
  searchTerm: zod.string().trim().toLowerCase().optional(),

  startDate: zod.coerce.date().optional(),
  endDate: zod.coerce.date().optional(),

  minAmount: zod.coerce.number().optional(),
  maxAmount: zod.coerce.number().optional(),

  page: zod.coerce.number().min(1).default(1),
  skip: zod.coerce.number().min(10).default(10),
});
