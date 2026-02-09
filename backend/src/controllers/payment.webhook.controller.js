/*
//DARAJA Webhook


const prisma = require('../prisma/client');

exports.mpesaWebhook = async (req, res) => {
  try {
    const callback = req.body?.Body?.stkCallback;

    if (!callback) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = callback;

    // Find payment by checkoutRequestId
    const payment = await prisma.payment.findFirst({
      where: { checkoutRequestId: CheckoutRequestID }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (ResultCode !== 0) {
      // Payment failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failureReason: ResultDesc
        }
      });

      return res.json({ ResultCode: 0, ResultDesc: 'Handled' });
    }

    // Extract metadata
    const metadata = {};
    CallbackMetadata.Item.forEach(i => {
      metadata[i.Name] = i.Value;
    });

    const receipt = metadata.MpesaReceiptNumber;
    const amountPaid = metadata.Amount;

    // Mark payment as PAID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'PAID',
        mpesaReceipt: receipt,
        paidAmount: amountPaid,
        paidAt: new Date()
      }
    });

    // OPTIONAL: mark booking as CONFIRMED
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: 'CONFIRMED' }
    });

    return res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};

*/
///Paystack webhook.
const crypto = require("crypto");
const paymentService = require("../services/payment.service");

exports.paystackWebhook = async (req, res) => {
  const signature = req.headers["x-paystack-signature"];

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET)
    .update(req.body)
    .digest("hex");

  if (hash !== signature) {
    return res.status(401).send("Invalid signature");
  }

  const event = JSON.parse(req.body.toString());

if (event.event === "charge.success") {
  const reference = event.data.reference;

  try {
    await paymentService.verifyPayment(reference);
    console.log(`✅ Verified payment ${reference}`);
  } catch (err) {
    console.error(`❌ Webhook verify failed for ${reference}:`, err.message);
  }
}

res.sendStatus(200); // always respond 200

};
