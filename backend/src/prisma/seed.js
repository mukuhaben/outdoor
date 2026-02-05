const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const activities = [
    { name: "Biking", slug: "biking" },
    { name: "Trekking", slug: "trekking" },
    { name: "Tour", slug: "tour" },
    { name: "Hiking", slug: "hiking" },
    { name: "Team Building", slug: "team-building" },
  ];

  for (const activity of activities) {
    await prisma.activity.upsert({
      where: { slug: activity.slug }, // use slug as unique identifier
      update: {},                     // do nothing if exists
      create: {
        name: activity.name,
        slug: activity.slug,
        createdAt: new Date(),        // set current timestamp
      },
    });
  }

  console.log("Activity table seeded successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
