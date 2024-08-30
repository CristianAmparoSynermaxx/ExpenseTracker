const express = require("express");
const {
  getBalance,
  editBalance,
  addBalance,
  getHistory,
} = require("../controller/balanceController");
const router = express.Router();

router.get("/:id", getBalance);
router.get("/history/:id", getHistory);
router.post("/:id", addBalance);
router.put("/:id", editBalance);

module.exports = router;
