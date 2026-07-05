import { Expense } from "../models/Expense";
import type { DashboardStatsType, MonthlyTotalType } from "../types";
import { getCurrentMonth } from "../utils/getCurrentMonth";
import { getMonthString } from "../utils/getMonthString";
import { asyncHandler, sendError, sendSuccess } from "../utils/responseHelpers";
import { type Request, type Response } from "express";

const getExpensesByCategories = asyncHandler(
  async function getExpensesByCategories(req: Request, res: Response) {
    const userId = req.userId;

    const userExpenses = (await Expense.find({ userId })) || [];

    if (userExpenses.length === 0) {
      sendSuccess(
        res,
        [],
        "No expenses were found. Create an expense to get started",
        200,
      );
      return;
    }

    const totalAmountPerCategory = userExpenses.reduce(
      (acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = { total: 0, count: 0 };
        }

        acc[expense.category].total += expense.amount;
        acc[expense.category].count += 1;

        return acc;
      },
      {} as Record<string, { total: number; count: number }>,
    );

    const grandTotalAmountOfAllCategories = Object.values(
      totalAmountPerCategory,
    ).reduce((acc, cat) => (acc += cat.total), 0);

    const categoriesStats = Object.entries(totalAmountPerCategory).map(
      ([categoryName, categoryData]) => {
        return {
          category: categoryName,
          ...categoryData,
          percentage: Math.round(
            (categoryData.total / grandTotalAmountOfAllCategories) * 100,
          ),
          total: Math.round(categoryData.total * 100) / 100, //this would limit the decimals to two points
        };
      },
    );
    // sort asc
    categoriesStats.sort((a, b) => a.total - b.total);

    sendSuccess(res, categoriesStats, "Category breakdown retrieved!", 200);
  },
);

const getMonthlyTotalsOfOneYear = asyncHandler(
  async function getExpensesByMonthlyTotals(req: Request, res: Response) {
    const userId = req.userId;

    const userExpenses = (await Expense.find({ userId })) || [];

    if (userExpenses.length === 0) {
      sendSuccess(
        res,
        [],
        "No expenses were found. Create an expense to get started",
        200,
      );
      return;
    }

    const currentYear = new Date().getFullYear();

    const year = req.query.year ? Number(req.query.year) : currentYear; //by default will sort by current year.

    const month = req.query.month ? Number(req.query.month) : null;

    if (isNaN(year)) {
      sendError(res, "Year must be a valid number.", 400);
      return;
    }
    // things that not yet happened,  couldn't be sorted
    // the idea is to sort already done expenses.
    if (year < 1990 || year > currentYear + 1) {
      sendError(res, "Year must be between 1990 and the current year", 400);
      return;
    }

    if (month && isNaN(month)) {
      sendError(res, "Month must be a valid number", 400);
      return;
    }

    const filteredExpensesByYear = userExpenses.filter((expense) => {
      if (expense.userId !== userId) return;
      if (year && new Date(expense.date).getFullYear() !== year) {
        return false;
      }
      if (month && new Date(expense.date).getMonth() + 1 !== month) {
        return false;
      }

      return expense;
    });

    if (filteredExpensesByYear.length === 0) {
      sendSuccess(res, [], "No expenses were found for this year", 200);
      return;
    }

    const totalExpensesOfTheYearSortedMontly = filteredExpensesByYear.reduce(
      (acc, value) => {
        const monthString = getMonthString(value.date);

        if (!acc[monthString]) {
          acc[monthString] = { total: 0, count: 0, month: monthString };
        }

        acc[monthString].total += value.amount;
        acc[monthString].count += 1;

        return acc;
      },
      {} as Record<string, MonthlyTotalType>,
    );

    const monthlyTotalArray = Object.values(totalExpensesOfTheYearSortedMontly);

    monthlyTotalArray.sort((a, b) => {
      return a.month.localeCompare(b.month);
    });

    monthlyTotalArray.forEach((month) => {
      month.total = Math.round(month.total * 100) / 100; //this would limit the decimals to two points
    });

    sendSuccess(
      res,
      monthlyTotalArray,
      `monthly totals for ${year} retrieved successfully`,
      200,
    );
    return;
  },
);

const getDashboardStats = asyncHandler(async function getDashboardStats(
  req: Request,
  res: Response,
) {
  const userId = req.userId;

  const userExpenses = (await Expense.find({ userId })) || [];

  if (userExpenses.length === 0) {
    sendSuccess(
      res,
      [],
      "No expenses were found. Create an expense to get started",
      200,
    );
    return;
  }

  const totalExpenses = userExpenses.reduce((acc, expense) => {
    return acc + expense.amount;
  }, 0);

  const averageExpense = totalExpenses / userExpenses.length;

  const highestAndLowestExpenses = userExpenses.reduce(
    (acc, expense) => {
      if (!acc.lowestExpense && expense.amount > 0) {
        acc.lowestExpense = expense.amount;
      }

      if (acc.highestExpense < expense.amount) {
        acc.highestExpense = expense.amount;
      }

      if (acc.lowestExpense > expense.amount) {
        acc.lowestExpense = expense.amount;
      }
      return acc;
    },
    { highestExpense: 0, lowestExpense: 0 },
  );

  const highestExpense = userExpenses.find(
    (exp) => exp.amount === highestAndLowestExpenses.highestExpense,
  );
  const lowestExpense = userExpenses.find(
    (exp) => exp.amount === highestAndLowestExpenses.lowestExpense,
  );
  if (!highestExpense || !lowestExpense) {
    return sendError(res, "No expenses were found");
  }

  const currentMonth = getCurrentMonth();

  const currentMonthExpenses = userExpenses.filter((exp) => {
    return (
      getMonthString(exp.date) ===
      getMonthString(new Date(new Date().setMonth(currentMonth - 1)))
    );
  });

  const currentMonthTotal = currentMonthExpenses.reduce(
    (acc, exp) => (acc += exp.amount),
    0,
  );

  const prevMonthExpenses = userExpenses.filter((exp) => {
    return (
      getMonthString(exp.date) ===
      getMonthString(new Date(new Date().setMonth(currentMonth - 2)))
    );
  });

  const prevMonthTotal = prevMonthExpenses.reduce(
    (acc, exp) => (acc += exp.amount),
    0,
  );

  let monthlyPercentageExpenseChange = 0;
  if (prevMonthTotal > 0) {
    monthlyPercentageExpenseChange = Math.round(
      ((prevMonthTotal - currentMonthTotal) / prevMonthTotal) * 100,
    );
  } else if (currentMonthTotal > 0) {
    monthlyPercentageExpenseChange = 100;
  }

  const stats: DashboardStatsType = {
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    averageExpense: Math.round(averageExpense * 100) / 100,
    highestExpense,
    lowestExpense,
    currentMonthTotal: Math.round(currentMonthTotal * 100) / 100,
    prevMonthTotal: Math.round(prevMonthTotal * 100) / 100,
    monthlyPercentageExpenseChange,
    expenseCount: userExpenses.length,
  };

  sendSuccess(res, stats, "Dashboard statistics retrieved.", 200);
});

// GET TRANDS OVER THE LAST 6 MONTHS
const getSpendingTrends = asyncHandler(async function getSpendingTrends(
  req: Request,
  res: Response,
) {
  const userId = req.userId;

  const userExpenses = (await Expense.find({ userId })) || [];

  if (userExpenses.length === 0) {
    sendSuccess(
      res,
      [],
      "No expenses were found. Create an expense to get started",
      200,
    );
    return;
  }

  const currentMonth = getCurrentMonth();
  const trends = [];
  // TODO make trends dynamic by any nr of months.
  for (let i = 6; i >= 1; i--) {
    const month = new Date().setMonth(currentMonth - i);

    const monthString = getMonthString(new Date(month));

    const monthExpenses = userExpenses.filter((exp) => {
      if (getMonthString(exp.date) === monthString) {
        return exp;
      }
    });
    const monthTotal = monthExpenses.reduce(
      (acc, exp) => (acc += exp.amount),
      0,
    );

    trends.push({
      month: monthString,
      total: Math.round(monthTotal * 100) / 100,
      count: monthExpenses.length,
    });
  }

  sendSuccess(res, trends, "Spending trends retrieved.", 200);
});

export {
  getExpensesByCategories,
  getMonthlyTotalsOfOneYear,
  getDashboardStats,
  getSpendingTrends,
};
