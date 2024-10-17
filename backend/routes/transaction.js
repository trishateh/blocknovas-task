const express = require("express");
const router = express.Router();

const {
  fetchWhaleAccounts,
  setCronInterval,
} = require("../controllers/TransactionController");

router.get("/accounts", fetchWhaleAccounts);
router.post("/set-interval", setCronInterval);

module.exports = router;
