import "dotenv/config";
import { prisma } from "../lib/prismaClient";

// List of placeholder image URLs (using Unsplash property images)
const imageUrls = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1568605117035-8c1825a1d67a?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560448075-cbc16bb4af33?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560448204-61dc36dc5fbc?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560448205-97abe736d2e0?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560448204-4c9b3e6e5b8f?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560448204-97abe736d2e0?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560448204-61dc36dc5fbc?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1568605117035-8c1825a1d67a?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560448075-cbc16bb4af33?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
];

// Helper function to get 3 random images
function getRandomImages(): string[] {
  const shuffled = [...imageUrls].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

async function main() {
  // Dynamic import for ESM-only Faker (required for CommonJS compatibility)
  const { faker } = await import("@faker-js/faker");

  const count = 50;

  console.log("🌱 Starting property seed (MongoDB)...");

  // Get all users to assign properties to
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  if (users.length === 0) {
    console.error("❌ No users found. Please seed users first.");
    process.exit(1);
  }

  const propertyTypes = [
    "apartment",
    "house",
    "condo",
    "villa",
    "townhouse",
    "studio",
  ];
  const statuses = ["available", "sold", "rented", "pending"];

  const properties = Array.from({ length: count }, () => {
    const propertyType = faker.helpers.arrayElement(propertyTypes);
    const status = faker.helpers.weightedArrayElement([
      { weight: 7, value: "available" },
      { weight: 1, value: "sold" },
      { weight: 1, value: "rented" },
      { weight: 1, value: "pending" },
    ])!;

    // Generate realistic property data
    const bedrooms = faker.helpers.arrayElement([1, 2, 3, 4, 5, 6]);
    const bathrooms = Math.max(
      1,
      bedrooms - faker.number.int({ min: 0, max: 2 })
    );
    const area = faker.number.int({ min: 500, max: 5000 }); // sqft
    const pricePerSqft = faker.number.int({ min: 100, max: 500 });
    const price = bedrooms * bathrooms * area * (pricePerSqft / 100);

    return {
      // Let MongoDB generate _id/ObjectId automatically
      title: faker.helpers.arrayElement([
        `${faker.location.city()} ${propertyType}`,
        `Beautiful ${propertyType} in ${faker.location.city()}`,
        `Luxury ${propertyType} with ${bedrooms} bedrooms`,
        `Modern ${propertyType} - ${faker.location.city()}`,
        `Spacious ${propertyType} for Sale`,
        `${propertyType} in Prime Location`,
      ]),
      description: faker.lorem.paragraphs(
        faker.number.int({ min: 2, max: 4 }),
        "\n\n"
      ),
      price: price,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      bedrooms,
      bathrooms,
      area,
      propertyType,
      status,
      images: getRandomImages(),
      userId: faker.helpers.arrayElement(users).id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  const result = await prisma.property.createMany({
    data: properties,
  });

  console.log(
    `✅ Seeded ${result.count} properties (${
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
