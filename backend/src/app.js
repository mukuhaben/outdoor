const express = require("express");
const cors = require("cors");
const path = require("path");// to serve frontend folder

const paymentWebhookRoutes = require('./routes/payment.webhook.routes');
const bookingRoutes = require("./routes/booking.routes");
const paymentRoutes = require("./routes/payment.routes");
const adminRoutes = require("./routes/admin.routes");
const eventsRoutes = require('./routes/event.routes');

const app = express();

app.use('/api/payments/webhook', paymentWebhookRoutes);//If express.json() runs first → webhook signature breaks.hence must be placd above express.json

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));//uploads static files.
// Serve frontend folder
app.use(express.static(path.join(__dirname, "../../frontend")));
// Admin pages fallback
app.get("/admin/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/admin", "index.html")
  );
});





app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/events', eventsRoutes)

module.exports = app;
