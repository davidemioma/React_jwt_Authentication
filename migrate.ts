// Then run: bun migrate.ts

// To access studio: bunx drizzle-kit studio

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

// for migrations
const migrationClient = postgres(process.env.DATABASE_URL || "", {
  max: 1,
  // For Cloud solutions
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
});

await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });

console.log("Migration completed");
