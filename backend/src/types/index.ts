import { type Document } from "mongoose";
export enum ExpenseCategory {
  ALL = "all",
  TRANSPORT = "transport",
  UTILITIES = "utilities",
  ENTERTAINMENT = "entertainment",
  HEALTHCARE = "healthcare",
  SHOPPINHG = "shopping",
  EDUCATION = "education",
  GROCERIES = "groceries",
  FOOD = "food",
  DRINKS = "drinks",
  OTHER = "other",
}

export enum ExpenseSort {
  AMOUNT_ASC = "amount",
  AMOUNT_DESC = "-amount",
  DATE_ASC = "date",
  DATE_DESC = "-date",
}

export type ExpenseType = {
  _id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date; //when the expense actually happened
  createdAt: Date;
  updatedAt: Date;
};

export type MongodbExpenseType = Document & Omit<ExpenseType, "_id">;

export type UserType = {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  currency: string;
};

export type MongodbUserType = Document &
  Omit<UserType, "_id"> & {
    otp?: number;
    otpExpiresAt?: Date;
    verifiedOtp?: boolean;
    refreshToken?: string;
    refreshTokenExpiresAt?: Date;
  };
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message: string;
};

export type AuthResponse = {
  user: Omit<UserType, "password">;
  token?: string;
};

export type MonthlyTotalType = {
  month: string;
  total: number;
  count: number;
};

export type DashboardStatsType = {
  totalExpenses: number;
  averageExpense: number;
  highestExpense: MongodbExpenseType;
  lowestExpense: MongodbExpenseType;
  currentMonthTotal: number;
  prevMonthTotal: number;
  monthlyPercentageExpenseChange: number;
  expenseCount: number;
};
