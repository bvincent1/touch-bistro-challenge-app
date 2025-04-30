import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/modules/*/models.ts",
  dialect: "postgresql",
  dbCredentials: {
    database: process.env.POSTGRES_DB!,
    user: process.env.POSTGRES_USER!,
    port: Number(process.env.POSTGRES_PORT),
    password: process.env.POSTGRES_PASSWORD!,
    host: process.env.POSTGRES_HOST!,
  },
});
