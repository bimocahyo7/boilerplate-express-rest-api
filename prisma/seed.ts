import { PrismaClient } from "@prisma/client";
import userSeed from "./seeder/users/users.seed";

const prisma = new PrismaClient({
  log: ['query', 'error'],
});

async function main() {
  try {
    await userSeed(prisma);
  } catch (error) {
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
