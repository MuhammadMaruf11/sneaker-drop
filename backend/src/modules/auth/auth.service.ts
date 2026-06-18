import { prisma } from "../../config/db";

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { username: "asc" },
    select: { id: true, username: true },
  });
}

export async function createUser(username: string) {
  if (!username || username.trim().length < 2) {
    throw new Error("Username must be at least 2 characters");
  }
  return prisma.user.create({
    data: { username: username.trim() },
    select: { id: true, username: true },
  });
}
