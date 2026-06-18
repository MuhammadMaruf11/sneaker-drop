import "dotenv/config";
import { prisma } from "../src/config/db";

async function main() {
  console.log("Seeding database...");

  await prisma.purchase.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.drop.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all([
    prisma.user.create({ data: { username: "john_doe" } }),
    prisma.user.create({ data: { username: "sarah_kim" } }),
    prisma.user.create({ data: { username: "alex_roy" } }),
  ]);

  const drop = await prisma.drop.create({
    data: {
      name: "Air Jordan 1",
      totalStock: 100,
      availableStock: 100,
      startTime: new Date(),
    },
  });

  await prisma.purchase.createMany({
    data: [
      { userId: users[0].id, dropId: drop.id },
      { userId: users[1].id, dropId: drop.id },
      { userId: users[2].id, dropId: drop.id },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
