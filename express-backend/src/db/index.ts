import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle({
  connection: {
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    port: Number(process.env.POSTGRES_PORT),
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    ssl: !!process.env.POSTGRES_SSL,
  },
  logger: true,
});

export default db;
