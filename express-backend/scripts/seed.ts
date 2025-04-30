import db from "../src/db";
import { quizzes as quizzesTable } from "../src/modules/quizzes/models";
import { questions as questionsTable } from "../src/modules/questions/models";

import quizzes from "./fixtures/quizzes.json";
import questions from "./fixtures/questions.json";

async function main() {
  await db.insert(quizzesTable).values(quizzes);
  await db.insert(questionsTable).values(questions);
}

main();
