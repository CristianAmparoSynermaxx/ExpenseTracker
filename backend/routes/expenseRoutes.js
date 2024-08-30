const express = require("express");
const {
  getExpenses,
  getExpense,
  addExpense,
  deleteExpense,
  updateExpense,
} = require("../controller/expenseController");
const router = express.Router();

router.get("/:id", getExpenses);
router.get("/:id", getExpense);
router.post("/", addExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
