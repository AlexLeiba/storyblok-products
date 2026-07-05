import { ExpenseCategory, type ExpenseType, type UserType } from "../types";

export const DEFAULT_ERROR_MESSAGE =
  "Something went wrong, please try again or contact support";
export const DEFAULT_VALIDATION_ERROR_MESSAGE =
  "Something went wrong when validating input data, please try again or contact support";

export const FAKE_USERS: UserType[] = [
  {
    _id: "1",
    name: "John Doe",
    email: "5o2q5@example.com",
    password: "password123",
    createdAt: new Date("2026-01-13"),
    updatedAt: new Date(),
    currency: "EUR",
  },
  {
    _id: "2",
    name: "Jane Doe",
    email: "t2oYK@example.com",
    password: "password123",
    createdAt: new Date(),
    updatedAt: new Date(),
    currency: "EUR",
  },
];

// object{
// cat[catname] = {total: 0, count: 0}
// }

export const FAKE_EXPENSES: ExpenseType[] = [
  {
    _id: "1",
    userId: "1",
    amount: 100.2121212,
    category: ExpenseCategory.GROCERIES,
    description: "Groceries",
    date: new Date("2022-04-01"),
    createdAt: new Date("2022-01-01"),
    updatedAt: new Date("2022-01-01"),
  },
  {
    _id: "1",
    userId: "1",
    amount: 115.632323232,
    category: ExpenseCategory.GROCERIES,
    description: "Groceries",
    date: new Date("2026-06-01"),
    createdAt: new Date("2022-01-01"),
    updatedAt: new Date("2022-01-01"),
  },
  {
    _id: "1",
    userId: "1",
    amount: 100,
    category: ExpenseCategory.GROCERIES,
    description: "Groceries",
    date: new Date("2026-05-01"),
    createdAt: new Date("2022-01-01"),
    updatedAt: new Date("2022-01-01"),
  },
  {
    _id: "2",
    userId: "1",
    amount: 32.5,
    category: ExpenseCategory.ENTERTAINMENT,
    description: "Entertainment",
    date: new Date("2021-05-02"),
    createdAt: new Date("2021-03-02"),
    updatedAt: new Date("2022-01-02"),
  },
  {
    _id: "2",
    userId: "1",
    amount: 200,
    category: ExpenseCategory.ENTERTAINMENT,
    description: "Entertainment",
    date: new Date("2026-04-02"),
    createdAt: new Date("2021-03-02"),
    updatedAt: new Date("2022-01-02"),
  },
  {
    _id: "2",
    userId: "1",
    amount: 250,
    category: ExpenseCategory.FOOD,
    description: "Food",
    date: new Date("2026-04-02"),
    createdAt: new Date("2026-04-02"),
    updatedAt: new Date("2022-01-02"),
  },
  {
    _id: "2",
    userId: "1",
    amount: 123,
    category: ExpenseCategory.FOOD,
    description: "Food",
    date: new Date("2026-04-02"),
    createdAt: new Date("2026-04-02"),
    updatedAt: new Date("2022-01-02"),
  },
  {
    _id: "2",
    userId: "1",
    amount: 50.5,
    category: ExpenseCategory.FOOD,
    description: "Food",
    date: new Date("2026-04-02"),
    createdAt: new Date("2026-04-02"),
    updatedAt: new Date("2022-01-02"),
  },
];
