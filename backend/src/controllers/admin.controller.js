const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// ---------- ADMIN LOGIN ----------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin.id, role: "ADMIN" },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};

// ---------- CREATE EVENT ----------
exports.createEvent = async (req, res) => {
  const {
    title,
    description,
    activityId,
    location,
    difficulty,
    distanceKm
  } = req.body;

  const event = await prisma.event.create({
    data: {
      title,
      description,
      activityId,

      location: location?.trim() || null,
      difficulty: difficulty || null,
      distanceKm: distanceKm?.trim() || null,

      isActive: false
    }
  });

  res.json(event);
};



//---Publish event---//
exports.publishEvent = async (req, res) => {
  const event = await prisma.event.update({
    where: { id: req.params.id },
    data: { isActive: true }
  });

  res.json(event);
};
//---Unpublish event---//
exports.unpublishEvent = async (req, res) => {
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: { isActive: false } // mark as draft/unpublished
    });

    res.json(event);
  } catch (err) {
    console.error("Error unpublishing event:", err);
    res.status(500).json({ error: "Failed to unpublish event" });
  }
};


exports.updateScheduleStatus = async (req, res) => {
  const { status } = req.body;

  const schedule = await prisma.eventSchedule.update({
    where: { id: req.params.id },
    data: { status }
  });

  res.json(schedule);
};

//--Admin: list all events (draft + published) product card-//
exports.listEvents = async (req, res) => {
  const events = await prisma.event.findMany({
    include: {
      activity: true,
      schedules: true,
      images: true,
      pricing: true
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(events);
};

//--Admin: update event (edit metadata)--//
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    activityId,
    location,
    difficulty,
    distanceKm,
    isActive
  } = req.body;

  const event = await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      activityId,

      location: location?.trim() || null,
      difficulty: difficulty || null,
      distanceKm: distanceKm?.trim() || null,

      isActive:
        typeof isActive === "boolean" ? isActive : undefined
    }
  });

  res.json(event);
};

//--Admin: delete event (hard delete, no cascade changes)--//
exports.deleteEvent = async (req, res) => {
  await prisma.event.delete({
    where: { id: req.params.id }
  });

  res.json({ success: true });
};



//------create activity------//
const slugify = require("slugify");

exports.createActivity = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Activity name is required" });
  }

  const slug = slugify(name, {
    lower: true,
    strict: true,
    trim: true
  });

  const activity = await prisma.activity.create({
    data: {
      name,
      slug
    }
  });

  res.json(activity);
};

//update activity
exports.updateActivity = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Activity name is required" });
  }

  const slug = slugify(name, {
    lower: true,
    strict: true,
    trim: true
  });

  const activity = await prisma.activity.update({
    where: { id },
    data: {
      name,
      slug
    }
  });

  res.json(activity);
};



exports.listActivities = async (req, res) => {
  const activities = await prisma.activity.findMany({
    orderBy: { name: 'asc' }
  });
  res.json(activities);
};

//---CREATE PRICING---//
exports.createPricing = async (req, res) => {
  const { label, amount, currency } = req.body;

  const pricing = await prisma.pricingOption.create({
    data: {
      eventId: req.params.id,
      label,
      amount,
      currency,
      isActive: true
    }
  });

  res.json(pricing);
};

exports.updatePricing = async (req, res) => {
  const pricing = await prisma.pricingOption.update({
    where: { id: req.params.id },
    data: req.body
  });

  res.json(pricing);
};

exports.listPricing = async (req, res) => {
  const pricing = await prisma.pricingOption.findMany({
    where: { eventId: req.params.id }
  });
  res.json(pricing);
};


//---SCHEDULE CREATION & STATUS CONTROL---//
exports.addSchedule = async (req, res) => {
  const { date, duration } = req.body;

  const schedule = await prisma.eventSchedule.create({
    data: {
      eventId: req.params.id,
      date: new Date(date),
      status: 'UPCOMING',
      duration
    }
  });

  res.json(schedule);
};
//--updates schedules that have been edited after they had benn added
exports.updateSchedule = async (req, res) => {
  const { date, duration } = req.body;

  const schedule = await prisma.eventSchedule.update({
    where: { id: req.params.id },
    data: {
      date: date ? new Date(date) : undefined,
      duration
    }
  });

  res.json(schedule);
};

//--admin lists schedules for all events--//
exports.listSchedules = async (req, res) => {
  const schedules = await prisma.eventSchedule.findMany({
    where: { eventId: req.params.id },
    orderBy: { date: 'asc' }
  });

  res.json(schedules);
};
//--Admin: list event images (verification only)--//
exports.listEventImages = async (req, res) => {
  const images = await prisma.eventImage.findMany({
    where: { eventId: req.params.id }
  });

  res.json(images);
};


//----Uploading images---//
exports.uploadEventImage = async (req, res) => {
  const image = await prisma.eventImage.create({
    data: {
      eventId,
    path: filePath,
    imageUrl: filePath
    }
  });

  res.json(image);
};

