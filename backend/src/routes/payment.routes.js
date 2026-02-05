const express = require("express");
const router = express.Router();
const controller = require("../controllers/payment.controller");

router.post("/pay", controller.pay);
router.post("/verify", controller.verify);

module.exports = router;
