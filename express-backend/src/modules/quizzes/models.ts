import * as t from "drizzle-orm/pg-core";

export const quizzes = t.pgTable("quizzes", {
  id: t.uuid().primaryKey().defaultRandom(),
  title: t.varchar().notNull(),
  description: t.text().notNull(),
});
