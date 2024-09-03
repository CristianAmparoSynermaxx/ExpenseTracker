const db = require("../db"); // This should be your pool created with mysql2/promise
const asyncHandler = require("express-async-handler");

// Get expenses with pagination and filtering
const getExpenses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, filterBy } = req.query;
  const { id } = req.params;

  // Convert page and limit to integers
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  // Validate page and limit
  if (isNaN(pageNumber) || pageNumber <= 0) {
    return res.status(400).json({ error: "Invalid page number" });
  }
  if (isNaN(pageSize) || pageSize <= 0) {
    return res.status(400).json({ error: "Invalid limit" });
  }

  // Calculate offset
  const offset = (pageNumber - 1) * pageSize;

  // Build query with optional filter
  let query = "SELECT * FROM tbl_expense WHERE user_id = ?";
  const queryParams = [id];

  if (filterBy) {
    query += " AND expense_title LIKE ?";
    queryParams.push(`%${filterBy}%`);
  }

  // Pagination query
  query += " ORDER BY expense_date DESC LIMIT ? OFFSET ?";

  // Total count query
  const countQuery = `
    SELECT COUNT(*) as count 
    FROM tbl_expense 
    WHERE user_id = ?${filterBy ? " AND expense_title LIKE ?" : ""}
  `;
  const countQueryParams = [id];
  if (filterBy) countQueryParams.push(`%${filterBy}%`);

  // Total sum query
  const sumQuery = `
    SELECT SUM(expense_amount) as total_amount
    FROM tbl_expense
    WHERE user_id = ?${filterBy ? " AND expense_title LIKE ?" : ""}
  `;
  const sumQueryParams = [id];
  if (filterBy) sumQueryParams.push(`%${filterBy}%`);

  try {
    // Fetch paginated results
    const [results] = await db.query(query, [...queryParams, pageSize, offset]);

    // Fetch total count
    const [[{ count }]] = await db.query(countQuery, countQueryParams);

    // Fetch total expenses amount
    const [[{ total_amount }]] = await db.query(sumQuery, sumQueryParams);

    // Send response
    res.json({
      data: results,
      pagination: {
        total: count,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
      totalAmount: total_amount || 0, // Include total amount in response
    });
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

  if (!userId) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  if (!title) {
    return res.status(400).json({ error: "Please fill out the title field" });
  }
  if (!amount) {
    return res.status(400).json({ error: "Please fill out the amount field" });
  }
  if (category === "") {
    return res.status(400).json({ error: "Please select a category" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Add the new expense
    const addExpenseQuery =
      "INSERT INTO tbl_expense (user_id, expense_title, expense_category, expense_amount) VALUES (?, ?, ?, ?)";
    await connection.execute(addExpenseQuery, [
      userId,
      title,
      category,
      amount,
    ]);

    // Update the balance by subtracting the new expense amount
    const updateBalanceQuery =
      "UPDATE tbl_balance SET balance_amount = balance_amount - ? WHERE user_id = ?";
    await connection.execute(updateBalanceQuery, [amount, userId]);

    await connection.commit();

    // Get the updated balance
    const [balanceRows] = await connection.execute(
      "SELECT balance_amount FROM tbl_balance WHERE user_id = ?",
      [userId]
    );

    if (balanceRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Balance not found for the user" });
    }

    const newBalance = balanceRows[0].balance_amount;

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
// Update an existing expense and adjust the balance
const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, title, category, amount } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Not Authorized" });
  }
  if (!title) {
    return res.status(400).json({ error: "Please fill out the title field" });
  }
  if (!amount) {
    return res.status(400).json({ error: "Please fill out the amount field" });
  }
  if (category === "") {
    return res.status(400).json({ error: "Please select a category" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Get the initial expense amount
    const [initialExpenseResult] = await connection.execute(
      "SELECT expense_amount FROM tbl_expense WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (initialExpenseResult.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Expense not found" });
    }

    const initialExpenseAmount = initialExpenseResult[0].expense_amount;

    // Calculate the difference between the new and initial expense amounts
    const difference = amount - initialExpenseAmount;

    // Update the user's balance based on the difference
    await connection.execute(
      "UPDATE tbl_balance SET balance_amount = balance_amount - ? WHERE user_id = ?",
      [difference, userId]
    );

    // Update the expense record
    const updateExpenseQuery = `
      UPDATE tbl_expense 
      SET expense_title = ?, expense_category = ?, expense_amount = ? 
      WHERE id = ? AND user_id = ?
    `;
    await connection.execute(updateExpenseQuery, [
      title,
      category,
      amount,
      id,
      userId,
    ]);

    await connection.commit();

    res.json({
      message: "Expense updated and balance adjusted successfully",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating expense and adjusting balance: ", error);
    res.status(500).json({
      error:
        "An error occurred while updating the expense and adjusting balance",
    });
  } finally {
    connection.release();
  }
});

// Delete an expense by ID
const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Expense ID is required" });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Fetch the amount of the expense to be deleted
    const [expenseRows] = await connection.execute(
      "SELECT expense_amount, user_id FROM tbl_expense WHERE id = ?",
      [id]
    );

    if (expenseRows.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    const expenseAmount = expenseRows[0].expense_amount;
    const userId = expenseRows[0].user_id;

    // Delete the expense
    const [result] = await connection.execute(
      "DELETE FROM tbl_expense WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // Update the balance
    const [balanceRows] = await connection.execute(
      "SELECT balance_amount FROM tbl_balance WHERE user_id = ?",
      [userId]
    );

    if (balanceRows.length === 0) {
      return res.status(404).json({ error: "Balance not found for the user" });
    }

    const currentBalance = balanceRows[0].balance_amount;
    const newBalance = currentBalance + expenseAmount;

    await connection.execute(
      "UPDATE tbl_balance SET balance_amount = ? WHERE user_id = ?",
      [newBalance, userId]
    );

    await connection.commit();

    res.json({
      message: "Expense deleted and balance updated successfully",
      new_balance: newBalance,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting expense and updating balance: ", error);
    res.status(500).json({
      error:
        "An error occurred while deleting the expense and updating balance",
    });
  } finally {
    connection.release();
  }
});

module.exports = {
  getExpenses,
  getExpense,
  addExpense,
  updateExpense,
  deleteExpense,
};
