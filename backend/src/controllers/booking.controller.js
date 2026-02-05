const bookingService = require("../services/booking.service");

exports.createBooking = async (req, res) => {
  try {
    const result = await bookingService.createBooking(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
};
