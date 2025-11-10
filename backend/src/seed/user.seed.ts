import "dotenv/config";
import { prisma } from "../lib/prismaClient";
async function main() {
  // Dynamic import for ESM-only Faker (required for CommonJS compatibility)
  const { faker } = await import("@faker-js/faker");

  const count = 25;

  console.log("🌱 Starting user seed (MongoDB)...");

  const users = Array.from({ length: count }, () => {
    const first = faker.person.firstName();
    const last = faker.person.lastName();
    const name = `${first} ${last}`;
    const email = faker.internet
      .email({ firstName: first, lastName: last })
      .toLowerCase();
    return {
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
