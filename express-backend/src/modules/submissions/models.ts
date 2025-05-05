import * as t from "drizzle-orm/pg-core";
import { questions } from "../questions/models";

export const submissions = t.pgTable("submissions", {
  id: t.uuid().primaryKey().defaultRandom(),
  answer: t.text().notNull(),
  user: t.varchar().notNull(),
  question_id: t
    .uuid()
    .notNull()
    .references(() => questions.id),
});
