import { Request, Response } from "express";
import { type drizzle } from "drizzle-orm/node-postgres";
import { StatusCodes } from "http-status-codes";
import { eq, and, aliasedTable, sql, lt, or, isNull } from "drizzle-orm";
import _ from "lodash";

import { questions } from "./models";
import { submissions } from "../submissions/models";

/**
 * Get basic query for quizzes / questions, not await / async incase we want
 * to chain off the result
 * @param {ReturnType<typeof drizzle>} db - drizzle db connection
 * @returns {Promise}
 */
const getBaseQuery = (db: ReturnType<typeof drizzle>) => {
  const nextQuestionQuery = aliasedTable(questions, "next");
  const subs = db
    .select({
      question_id: submissions.question_id,
      count: sql<number>`cast(count(${submissions.id}) as int)`.as("count"),
    })
    .from(submissions)
    .groupBy(submissions.question_id)
    .as("subs");

  const main = db
    .select({
      id: questions.id,
      title: questions.title,
      description: questions.description,
      index: questions.index,
      quiz_id: questions.quiz_id,
      next: sql`${nextQuestionQuery.id} as next`,
    })
    .from(questions)
    .leftJoin(
      nextQuestionQuery,
      and(
        eq(questions.quiz_id, nextQuestionQuery.quiz_id),
        eq(questions.index, sql`next.index - 1`)
      )
    )
    .leftJoin(subs, eq(subs.question_id, questions.id))
    .where(or(lt(subs.count, 3), isNull(subs.count)))
    .as("main");

  return db
    .select({
      id: main.id,
      title: main.title,
      description: main.description,
      index: main.index,
      quiz_id: main.quiz_id,
      next: sql<string>`"next"`,
    })
    .from(main);
};

/**
 * Handle express GET "/api/questions"
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {ReturnType<typeof drizzle>} db - drizzle db object
 */
export async function handleGetAll(
  req: Request,
  res: Response,
  db: ReturnType<typeof drizzle>
): Promise<void> {
  if (!req.headers["quiz-user"]) {
    res.status(StatusCodes.OK).json([]);
  } else {
    const query = await getBaseQuery(db);
    res.status(StatusCodes.OK).json(Object.values(query));
  }
}

/**
 * Handle express GET "/api/questions/:id"
 * @param {Request} _req - Express Request object
 * @param {Response} res - Express Response object
 * @param {ReturnType<typeof drizzle>} db - drizzle db object
 */
export async function handleGet(
  req: Request<{ id: string }>,
  res: Response,
  db: ReturnType<typeof drizzle>
): Promise<void> {
  if (!req.headers["quiz-user"]) {
    res.status(StatusCodes.NOT_FOUND).json(null);
  } else {
    const query = await getBaseQuery(db).where(eq(sql`id`, req.params.id));
    if (_.isEmpty(query)) {
      res.status(StatusCodes.NOT_FOUND).json(null);
    }
    res.status(StatusCodes.OK).json(query[0]);
  }
}
