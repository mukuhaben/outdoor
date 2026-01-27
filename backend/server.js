require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ====================================
// HELPER: Normalize Kenyan Phone
// ====================================
function normalizeKenyanPhone(phone) {
  let p = phone.trim();

  if (p.startsWith("0")) return "+254" + p.slice(1);
  if (p.startsWith("254")) return "+" + p;
  if (p.startsWith("+254")) return p;

  throw new Error("Invalid phone number");
}

// ====================================
// Google Sheets
// ====================================
async function sendToGoogleSheets(data) {
  await axios.post(process.env.GOOGLE_SHEETS_URL, data, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}


// ====================================
// TRUSTED SERVER-SIDE PRICING
// ====================================
const PRICING = {
  "Bike Riding": {
    "Ngong Hills Loop": 1000,
    "Karura Forest Trail": 1200
  },
  "Hiking": {
    "Mount Longonot": 2000,
    "Elephant Hill": 2500
  },
   "Team Building": {
      "Forest Challenge Course": 3000,
      "Outdoor Games Park": 2500
    }
};

// ====================================
// ROUTE 1: INITIATE PAYSTACK STK PUSH
// ====================================
app.post("/pay", async (req, res) => {
  try {
    const { name, email, phone, activity, route, people } = req.body;

    if (!PRICING[activity] || !PRICING[activity][route]) {
      return res.status(400).json({ error: "Invalid activity or route" });
    }

    const amount = PRICING[activity][route] * Number(people);
    const formattedPhone = normalizeKenyanPhone(phone);

    const response = await axios.post(
      "https://api.paystack.co/charge",
      {
        email,
        amount: amount * 100,
        currency: "KES",
        mobile_money: {
          phone: formattedPhone,
          provider: "mpesa"
        },
        metadata: {
          name,
          phone: formattedPhone,
          activity,
          route,
          people
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      reference: response.data.data.reference
    });

  }catch (err) {
    if (err.response && err.response.data) {
        return res.status(400).json({
            error: err.response.data.data?.message || err.response.data.message
        });
    }
    res.status(500).json({ error: "Server error" });
}

});

// ====================================
// ROUTE 2: VERIFY PAYMENT → SAVE CSV
// ====================================
app.post("/verify", async (req, res) => {
  try {
    const { reference } = req.body;

    const verify = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
        }
      }
    );

    const data = verify.data.data;

    if (data.status !== "success") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const meta = data.metadata;

    await sendToGoogleSheets({
      name: meta.name,
      email: data.customer.email,
      phone: meta.phone,
      activity: meta.activity,
      route: meta.route,
      people: meta.people,
      amount: data.amount / 100,
      reference
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Verification failed" });
  }
});


// ====================================
// START SERVER
// ====================================
app.listen(3000, () => {
  console.log("✅ Trek N Tread backend running on port 3000");
});
