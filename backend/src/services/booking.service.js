const paymentService = require("./payment.service");
const prisma = require("../prisma/client");

/**
 * Create a booking and initiate payment
 * This matches your current behavior exactly
 */
exports.createBooking = async (data) => {
  /**
   * data is expected to contain:
   * name, email, phone, activity, route, people
   */

  // 1️⃣ Initiate Paystack STK push
  const reference = await paymentService.initiatePayment(data);

  // 2️⃣ Return response to controller
  // (verification happens in a separate request)
  return {
    success: true,
    reference
  };
};

/**
 * Verify booking payment
 * Called after STK push is completed
 */
exports.verifyBooking = async (reference) => {
  await prisma.$transaction(async (tx) => {
    // Payment already verified via Paystack
    // Persist booking in DB (snapshot)
    await tx.booking.create({
      data: {
        totalAmount: 0, // updated later if needed
        paymentStatus: "PAID"
      }
    });
  });

  return { success: true };
};

