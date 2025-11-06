import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Dynamic import for ESM-only Faker (required for CommonJS compatibility)
  const { faker } = await import("@faker-js/faker");

  const count = 25;

  console.log("🌱 Starting seed...");

  const users = Array.from({ length: count }, () => {
    const first = faker.person.firstName();
    const last = faker.person.lastName();
    const name = `${first} ${last}`;
    const email = faker.internet
      .email({ firstName: first, lastName: last })
      .toLowerCase();

    return {
      id: faker.string.uuid(),
      name,
      email,
      password: faker.internet.password({ length: 12 }),
      role: faker.helpers.weightedArrayElement([
        { weight: 9, value: "user" },
        { weight: 1, value: "admin" },
      ])!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  const result = await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log(
    `✅ Seeded ${result.count} users (${
      count - result.count
    } duplicates skipped)`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
