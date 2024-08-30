const db = require("../db"); // This should be your pool created with mysql2/promise
const asyncHandler = require("express-async-handler");

// Get expenses with pagination and filtering
const getExpenses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, filterBy } = req.query;
  const { id } = req.params;
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  if (isNaN(offset) || isNaN(parseInt(limit, 10))) {
    return res.status(400).json({ error: "Invalid pagination parameters" });
  }

  let query = "SELECT * FROM tbl_expense WHERE user_id = ?";
  const queryParams = [id];

  if (filterBy) {
    query += " WHERE expense_title LIKE ?";
    queryParams.push(`%${filterBy}%`);
  }

  query += " LIMIT ? OFFSET ?";
  queryParams.push(parseInt(limit, 10), offset);

  try {
    const [results] = await db.query(query, queryParams);
    res.json(results);
  } catch (error) {
    console.error("Error fetching expenses: ", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching expenses" });
  }
});

// Get a single expense by ID
const getExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Expense ID is required" });
  }

  try {
    const query = "SELECT * FROM tbl_expense WHERE id = ?";
    const [results] = await db.execute(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching expense: ", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the expense" });
  }
});

// Add a new expense and update balance
const addExpense = asyncHandler(async (req, res) => {
  const { userId, title, category, amount } = req.body;

  if (
    !userId ||
    !title ||
    category === "Select Category" ||
    !amount ||
    amount <= 0
  ) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const addExpenseQuery =
      "INSERT INTO tbl_expense (user_id, expense_title, expense_category, expense_amount) VALUES (?, ?, ?, ?)";
    await connection.execute(addExpenseQuery, [
      userId,
      title,
      category,
      amount,
    ]);

    const [expenseRows] = await connection.execute(
      "SELECT SUM(expense_amount) AS total_expenses FROM tbl_expense WHERE user_id = ?",
      [userId]
    );
    const totalExpenses = expenseRows[0].total_expenses || 0;

    const [balanceRows] = await connection.execute(
      "SELECT balance_amount FROM tbl_balance WHERE user_id = ?",
      [userId]
    );

    if (balanceRows.length === 0) {
      return res.status(404).json({ error: "Balance not found for the user" });
    }

    const currentBalance = balanceRows[0].balance_amount;
    const newBalance = currentBalance - totalExpenses;

    await connection.execute(
      "UPDATE tbl_balance SET balance_amount = ? WHERE user_id = ?",
      [newBalance, userId]
    );

    await connection.commit();

    res.json({
      message: "Expense added and balance updated successfully",
      new_balance: newBalance,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error adding expense and updating balance: ", error);
    res.status(500).json({
      error: "An error occurred while adding expense and updating balance",
    });
  } finally {
    connection.release();
  }
});

// Update an existing expense
const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, title, category, amount } = req.body;

  if (
    !id ||
    !userId ||
    !title ||
    !category ||
    category === "Select Category" ||
    !amount
  ) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    const query =
      "UPDATE tbl_expense SET expense_title = ?, expense_category = ?, expense_amount = ? WHERE id = ? AND user_id = ?";
    await db.execute(query, [title, category, amount, id, userId]);

    res.json({ message: "Expense updated successfully" });
  } catch (error) {
    console.error("Error updating expense: ", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the expense" });
  }
});

// Delete an expense by ID
const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Expense ID is required" });
  }

  try {
    const [result] = await db.execute("DELETE FROM tbl_expense WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense: ", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the expense" });
  }
});

module.exports = {
  getExpenses,
  getExpense,
  addExpense,
  updateExpense,
  deleteExpense,
};
