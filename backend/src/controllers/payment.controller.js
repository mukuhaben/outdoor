const paymentService = require("../services/payment.service");

exports.pay = async (req, res) => {
  try {
    const reference = await paymentService.initiatePayment(req.body);
    res.json({ success: true, reference });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.verify = async (req, res) => {
  try {
    await paymentService.verifyPayment(req.body.reference);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
