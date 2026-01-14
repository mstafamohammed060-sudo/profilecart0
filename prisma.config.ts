// prisma.config.ts - Minimal working version
import "dotenv/config";

export default {
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
  // Prisma will read DATABASE_URL from .env automatically
};