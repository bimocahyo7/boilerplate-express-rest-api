import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../../src/utils/hash";

export default async function userSeed(prisma: PrismaClient) {
  try {
    await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        password: await hashPassword("admin123"),
      },
    });
    console.log("User seed data created successfully");
  } catch (error) {
    console.error("User seed error:", error);
    throw error;
  }
}
