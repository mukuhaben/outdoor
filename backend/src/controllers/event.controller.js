const prisma = require('../prisma/client');

exports.listPublicEvents = async (req, res) => {
  const events = await prisma.event.findMany({
    where: {
      isActive: true,
      schedules: {
        some: {
          status: { in: ['UPCOMING', 'FULL'] }
        }
      }
    },
    include: {
      activity: true,
      schedules: {
        where: { status: { in: ['UPCOMING', 'FULL'] } }
      },
      images: { take: 1 },
      pricing: { where: { isActive: true } }
    }
  });

  res.json(events);
};

// gets specific evend by eventId
exports.getPublicEventById = async (req, res) => {
  const { id } = req.params;

  const event = await prisma.event.findFirst({
    where: {
      id,
      isActive: true
    },
    include: {
      activity: true,
      schedules: {
        where: { status: { in: ['UPCOMING', 'FULL'] } }
      },
      images: { take: 1 },
      pricing: { where: { isActive: true } }
    }
  });

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  res.json(event);
};

