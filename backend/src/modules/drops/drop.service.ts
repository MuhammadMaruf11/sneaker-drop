import { prisma } from "../../config/db";

type CreateDropInput = {
  name: string;
  totalStock: number;
  startTime: string | Date;
};

export async function createDrop({ name, totalStock, startTime }: CreateDropInput) {
  if (!name) throw new Error("Drop name is required");
  if (!Number.isInteger(totalStock) || totalStock < 0)
    throw new Error("totalStock must be a non-negative integer");

  const parsedStartTime = new Date(startTime);
  if (Number.isNaN(parsedStartTime.getTime()))
    throw new Error("startTime must be a valid date");

  return prisma.drop.create({
    data: { name, totalStock, availableStock: totalStock, startTime: parsedStartTime },
  });
}

export async function listDropsWithStock() {
  const drops = await prisma.drop.findMany({
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      name: true,
      totalStock: true,
      availableStock: true,
      startTime: true,
      stockVersion: true,
      updatedAt: true,
      purchases: {
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          createdAt: true,
          user: { select: { id: true, username: true } },
        },
      },
    },
  });

  return drops.map((drop) => ({
    id: drop.id,
    name: drop.name,
    totalStock: drop.totalStock,
    availableStock: drop.availableStock,
    startTime: drop.startTime,
    stockVersion: drop.stockVersion,
    updatedAt: drop.updatedAt,
    recentBuyers: drop.purchases.map((p) => ({
      username: p.user.username,
      userId: p.user.id,
      purchasedAt: p.createdAt,
    })),
  }));
}