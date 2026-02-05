/*
//Daraja safaricom mpesa webhook

const express = require('express');
const { mpesaWebhook } = require('../controllers/payment.webhook.controller');

const router = express.Router();

// Safaricom webhook
router.post('/mpesa', mpesaWebhook);

module.exports = router;


*/

//Paystack webhook

const express = require("express");
const { paystackWebhook } = require("../controllers/payment.webhook.controller");

const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), paystackWebhook);

module.exports = router;
