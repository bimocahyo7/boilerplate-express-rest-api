import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../../src/utils/hash";
import { validateRegisterInput } from "../../../src/validation/auth/auth.validator";

export default async function userSeed(prisma: PrismaClient) {
  try {
    const data = {
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
    };

    const validated = validateRegisterInput(data);

    if (!validated) {
      throw new Error("Validation failed for user seed data");
    }

    const userData = {
      ...validated,
      password: await hashPassword(validated.password),
    };

    const user = await prisma.user.create({
      data: userData,
    });

    console.log("User seed data created successfully", user);
  } catch (error) {
    console.error("User seed error:");
    throw error;
  }
}
