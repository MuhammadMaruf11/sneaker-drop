import { prisma } from "../../config/db";

type CreateDropInput = {
  name: string;
  totalStock: number;
  startTime: string | Date;
};

export async function createDrop({
  name,
  totalStock,
  startTime,
}: CreateDropInput) {
  if (!name) {
    throw new Error("Drop name is required");
  }

  if (!Number.isInteger(totalStock) || totalStock < 0) {
    throw new Error("totalStock must be a non-negative integer");
  }

  const parsedStartTime = new Date(startTime);

  if (Number.isNaN(parsedStartTime.getTime())) {
    throw new Error("startTime must be a valid date");
  }

  return prisma.drop.create({
    data: {
      name,
      totalStock,
      availableStock: totalStock,
      startTime: parsedStartTime,
    },
  });
}

export async function listDropsWithStock() {
  return prisma.drop.findMany({
    orderBy: {
      startTime: "asc",
    },
    select: {
      id: true,
      name: true,
      totalStock: true,
      availableStock: true,
      startTime: true,
      stockVersion: true,
      updatedAt: true,
    },
  });
}
