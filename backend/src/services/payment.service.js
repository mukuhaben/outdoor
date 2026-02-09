const axios = require("axios");
const prisma = require("../prisma/client");
const { normalizeKenyanPhone } = require("../utils/phone.js");
const { sendReceiptEmail } = require("./email.service");
const { sendToGoogleSheets } = require("./sheets.service");

exports.initiatePayment = async (payload) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    pricingOptionId,
    quantity,
    totalAmount,
    scheduleId,
    activity, // title
    route,    // location
    priceOption
  } = payload;

  if (
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !pricingOptionId ||
    !quantity ||
    !totalAmount ||
    !scheduleId
  ) {
    throw new Error("Missing payment details");
  }

  const formattedPhone = normalizeKenyanPhone(customerPhone.trim());

  // Verify pricing option exists
  const pricingOptionRecord = await prisma.pricingOption.findUnique({
    where: { id: pricingOptionId }
  });
  if (!pricingOptionRecord || !pricingOptionRecord.isActive) {
    throw new Error("Invalid pricing option");
  }

  const response = await axios.post(
    "https://api.paystack.co/charge",
    {
      email: customerEmail.trim(),
      amount: Number(totalAmount) * 100,
      currency: "KES",
      mobile_money: {
        phone: formattedPhone,
        provider: "mpesa"
      },
      metadata: {
        name: customerName.trim(),
        phone: formattedPhone,
        scheduleId,
        pricingOptionId,
        people: quantity,
        activity: activity || "N/A",
        route: route || "N/A",
        priceOption: priceOption || pricingOptionRecord.label
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
      }
    }
  );

  return response.data.data.reference;
};

exports.verifyPayment = async (reference) => {
  // Check Paystack for transaction status
  const verify = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
    }
  );

  const data = verify.data.data;
  if (data.status !== "success") {
    throw new Error("Payment not completed");
  }

  const meta = data.metadata;

  // ✅ Avoid duplicates by checking Payment table
  const existingPayment = await prisma.payment.findUnique({
    where: { reference }
  });

  if (existingPayment) {
    console.log(`Payment ${reference} already processed. Skipping duplicate Google Sheet & email.`);
    return true;
  }

  // ✅ Create booking
  const booking = await prisma.booking.create({
    data: {
      scheduleId: meta.scheduleId,
      pricingOptionId: meta.pricingOptionId,
      customerName: meta.name,
      customerEmail: data.customer.email,
      customerPhone: meta.phone,
      quantity: parseInt(meta.people, 10),
      totalAmount: data.amount / 100,
      paymentStatus: "PAID"
    },
    include: { schedule: { include: { event: true } }, pricingOption: true } // include event info
  });

  // ✅ Save payment record
  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      provider: "PAYSTACK",
      reference,
      status: "PAID",
      verifiedAt: new Date(),
      rawData: data
    }
  });

  // Prepare data for Google Sheets and email
const bookingForSheets = {
  name: booking.customerName,
  email: booking.customerEmail,
  phone: booking.customerPhone,
  activity: booking.schedule.event.title,  // activity = title
  route: booking.schedule.event.location, // route = location
  people: booking.quantity,
  priceOption: meta.priceOption,
  amount: booking.totalAmount,
  reference
};

// Fire side-effects safely
Promise.allSettled([
  sendToGoogleSheets(bookingForSheets),
  sendReceiptEmail(bookingForSheets)
]).then(results => {
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(
        i === 0 ? "❌ Google Sheets failed" : "❌ Email failed",
        r.reason?.message || r.reason
      );
    }
  });
});

};
