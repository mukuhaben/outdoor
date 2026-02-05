const axios = require("axios");

exports.sendToGoogleSheets = async (data) => {
  await axios.post(process.env.GOOGLE_SHEETS_URL, data, {
    headers: { "Content-Type": "application/json" }
  });
};
