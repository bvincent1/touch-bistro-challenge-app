import * as t from "drizzle-orm/pg-core";

import { quizzes } from "../quizzes/models";

export const questions = t.pgTable("questions", {
  id: t.uuid().primaryKey().defaultRandom(),
  index: t.integer().default(0),
  title: t.varchar().notNull(),
  description: t.text().notNull(),
  correct_answer: t.text().notNull(),
  quiz_id: t
    .uuid()
    .notNull()
    .references(() => quizzes.id),
});
