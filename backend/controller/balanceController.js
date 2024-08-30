const asyncHandler = require("express-async-handler");
const db = require("../db"); // Adjust the path as necessary

const getBalance = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract user_id from route parameters

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const connection = await db.getConnection();
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
    // Ensure the connection is released back to the pool
    if (connection) {
      connection.release();
    }
  }
});

module.exports = getBalance;

const addBalance = asyncHandler(async (req, res) => {
  const { added_balance } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (added_balance === undefined || added_balance <= 0) {
    return res.status(400).json({ error: "Valid added balance is required" });
  }

  const connection = await db.getConnection(); // Get a connection from the pool
  try {
    await connection.beginTransaction();

    // Step 1: Check if balance record exists
    const [balanceRows] = await connection.execute(
      "SELECT balance_amount FROM tbl_balance WHERE user_id = ?",
      [id]
    );

    let currentBalance, newBalance;

    if (balanceRows.length === 0) {
      // Step 2: No record exists, create a new balance entry
      currentBalance = 0; // Initial balance if none exists
      newBalance = added_balance;

      await connection.execute(
        "INSERT INTO tbl_balance (user_id, balance_amount) VALUES (?, ?)",
        [id, newBalance]
      );
    } else {
      // Record exists, update the existing balance
      currentBalance = balanceRows[0].balance_amount;
      newBalance = currentBalance + added_balance;

      await connection.execute(
        "UPDATE tbl_balance SET balance_amount = ? WHERE user_id = ?",
        [newBalance, id]
      );
    }

    // Step 3: Log the transaction
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
    await connection.rollback();
    console.error("Error updating balance and recording history: ", error);
    return res.status(500).json({
      error:
        "An error occurred while updating the balance and recording the history",
    });
  } finally {
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = addBalance;

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

  const connection = await db.promise().getConnection();
  try {
    await connection.beginTransaction();

    // Step 1: Get the current balance
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

    // Step 2: Update the balance
    await connection.execute(
      "UPDATE tbl_balance SET balance_amount = ? WHERE user_id = ?",
      [new_balance, id]
    );

    // Step 3: Log the change in history
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
    await connection.rollback();
    console.error("Error updating balance and recording history: ", error);
    return res.status(500).json({
      error:
        "An error occurred while updating the balance and recording the history",
    });
  } finally {
    connection.release();
  }
});

const getHistory = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract user_id from route parameters

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const connection = await db.getConnection();
    const query = `
      SELECT id, user_id, remaining_balance, added_balance, new_balance, history_date
      FROM tbl_history
      WHERE user_id = ?
      ORDER BY history_date DESC
    `;
    const [rows] = await connection.execute(query, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No history found for the given user ID" });
    }

    return res.json({ history: rows });
  } catch (error) {
    console.error("Error retrieving history: ", error.message, error.stack);
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving the history" });
  } finally {
    // Ensure the connection is released back to the pool
    if (connection) {
      connection.release();
    }
  }
});

module.exports = getHistory;

module.exports = { getBalance, addBalance, editBalance, getHistory };
