const axios = require("axios");

exports.sendToGoogleSheets = async (data) => {
  if (!process.env.GOOGLE_SHEETS_URL) {
    throw new Error("GOOGLE_SHEETS_URL not set");
  }

  console.log("📄 Sending booking to Google Sheets");

  await axios.post(process.env.GOOGLE_SHEETS_URL, data, {
    headers: { "Content-Type": "application/json" },
    timeout: 15000
  });
};



/*
const axios = require("axios");

exports.sendToGoogleSheets = async (data) => {
  await axios.post(process.env.GOOGLE_SHEETS_URL, data, {
    headers: { "Content-Type": "application/json" }
  });
};
*/