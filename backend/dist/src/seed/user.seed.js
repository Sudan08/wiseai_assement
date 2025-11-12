"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prismaClient_1 = require("../lib/prismaClient");
async function main() {
    // Dynamic import for ESM-only Faker (required for CommonJS compatibility)
    const { faker } = await Promise.resolve().then(() => __importStar(require("@faker-js/faker")));
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
            ]),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    });
    const result = await prismaClient_1.prisma.user.createMany({
        data: users,
    });
    console.log(`✅ Seeded ${result.count} users (${count - result.count} duplicates skipped)`);
}
main()
    .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prismaClient_1.prisma.$disconnect();
});
