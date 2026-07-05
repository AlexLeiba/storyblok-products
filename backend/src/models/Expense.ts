// one to may relationship ( one user can have multiple expenses)

import { Schema, model } from "mongoose";

import type { MongodbExpenseType } from "../types";

const expenseSchema = new Schema<MongodbExpenseType>(
  {
    userId: {
      type: String,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Expense = model<MongodbExpenseType>("Expense", expenseSchema);
