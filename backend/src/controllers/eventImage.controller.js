exports.uploadEventImage = async (req, res) => {
  const { eventId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "Image file required" });
  }

  const image = await prisma.eventImage.create({
    data: {
      eventId,
      imageUrl: `/uploads/events/${req.file.filename}`,
      position: 0
    }
  });

  res.json(image);
};
