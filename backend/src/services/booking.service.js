
const paymentService = require("./payment.service");
const prisma = require("../prisma/client");
const { sendToGoogleSheets } = require("./sheets.service");
const { sendReceiptEmail } = require("./email.service");

exports.verifyBooking = async (reference) => {
  // 1️⃣ Fetch full booking/payment context
  // (adjust this based on how you store temp booking data)
  const bookingData = {
    name: "Customer Name",        // populate properly
    email: "customer@email.com",
    activity: "Hiking",
    route: "Ngong Hills",
    people: 2,
    amount: 5000,
    reference
  };

  // 2️⃣ Persist booking (SOURCE OF TRUTH)
  await prisma.booking.create({
    data: {
      paymentReference: reference,
      totalAmount: bookingData.amount,
      paymentStatus: "PAID"
    }
  });

  // 3️⃣ SIDE EFFECTS (DO NOT BLOCK)
  Promise.allSettled([
    sendToGoogleSheets(bookingData),
    sendReceiptEmail(bookingData)
  ]).then((results) => {
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(
          i === 0 ? "❌ Google Sheets failed" : "❌ Email failed",
          r.reason
        );
      }
    });
  });

  return { success: true };
};

