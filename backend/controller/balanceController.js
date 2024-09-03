const asyncHandler = require("express-async-handler");
const db = require("../db"); // Adjust the path if necessary

// Function to get balance for a user
const getBalance = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  let connection;
  try {
    connection = await db.getConnection();
    const query = "SELECT balance_amount FROM tbl_balance WHERE user_id = ?";
    const [rows] = await connection.execute(query, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Balance not found for the given user ID" });
    }

    return res.json({ balance: rows[0].balance_amount });
  } catch (error) {
    console.error("Error retrieving balance: ", error);
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving the balance" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Function to add balance for a user
const addBalance = asyncHandler(async (req, res) => {
  const { added_balance } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (added_balance === undefined || added_balance <= 0) {
    return res.status(400).json({ error: "Valid added balance is required" });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [balanceRows] = await connection.execute(
      "SELECT balance_amount FROM tbl_balance WHERE user_id = ?",
      [id]
    );

    let currentBalance =
      balanceRows.length > 0 ? balanceRows[0].balance_amount : 0;
    let newBalance = currentBalance + added_balance;

    if (balanceRows.length === 0) {
      await connection.execute(
        "INSERT INTO tbl_balance (user_id, balance_amount) VALUES (?, ?)",
        [id, newBalance]
      );
    } else {
      await connection.execute(
        "UPDATE tbl_balance SET balance_amount = ? WHERE user_id = ?",
        [newBalance, id]
      );
    }

    await connection.execute(
      "INSERT INTO tbl_history (user_id, remaining_balance, added_balance, new_balance) VALUES (?, ?, ?, ?)",
      [id, currentBalance, added_balance, newBalance]
    );

    await connection.commit();

    return res.json({
      message: "Balance updated and history recorded successfully",
      new_balance: newBalance,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error updating balance and recording history: ", error);
    return res.status(500).json({
      error:
        "An error occurred while updating the balance and recording the history",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Function to edit balance for a user
const editBalance = asyncHandler(async (req, res) => {
  const { new_balance } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (new_balance === undefined || new_balance < 0) {
    return res
      .status(400)
      .json({ error: "Valid new balance amount is required" });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [balanceRows] = await connection.execute(
      "SELECT balance_amount FROM tbl_balance WHERE user_id = ?",
      [id]
    );

    if (balanceRows.length === 0) {
      return res
        .status(404)
        .json({ error: "Balance not found for the given user ID" });
    }

    const currentBalance = balanceRows[0].balance_amount;

    await connection.execute(
      "UPDATE tbl_balance SET balance_amount = ? WHERE user_id = ?",
      [new_balance, id]
    );

    await connection.execute(
      "INSERT INTO tbl_history (user_id, remaining_balance, added_balance, new_balance) VALUES (?, ?, ?, ?)",
      [id, currentBalance, new_balance - currentBalance, new_balance]
    );

    await connection.commit();

    return res.json({
      message: "Balance updated and history recorded successfully",
      new_balance,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error updating balance and recording history: ", error);
    return res.status(500).json({
      error:
        "An error occurred while updating the balance and recording the history",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Function to get transaction history for a user
const getHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Validate page and limit
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  if (isNaN(pageNumber) || pageNumber <= 0) {
    return res.status(400).json({ error: "Invalid page number" });
  }

  if (isNaN(pageSize) || pageSize <= 0) {
    return res.status(400).json({ error: "Invalid limit" });
  }

  let connection;
  try {
    connection = await db.getConnection();
    const query = `
      SELECT id, user_id, remaining_balance, added_balance, new_balance, history_date
      FROM tbl_history
      WHERE user_id = ?
      ORDER BY history_date DESC
      LIMIT ? OFFSET ?
    `;

    // Calculate offset based on page number and page size
    const offset = (pageNumber - 1) * pageSize;
    const [rows] = await connection.execute(query, [id, pageSize, offset]);

    // Get total count of records for pagination
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM tbl_history
      WHERE user_id = ?
    `;
    const [countRows] = await connection.execute(countQuery, [id]);
    const totalRecords = countRows[0].total;

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No history found for the given user ID" });
    }

    return res.json({
      history: rows,
      pagination: {
        total: totalRecords,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(totalRecords / pageSize),
      },
    });
  } catch (error) {
    console.error("Error retrieving history: ", error.message, error.stack);
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving the history" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = { getBalance, addBalance, editBalance, getHistory };
