import { Request, Response } from "express";
import { type drizzle } from "drizzle-orm/node-postgres";
import { StatusCodes } from "http-status-codes";
import { questions } from "./models";
import { eq, and, aliasedTable, sql } from "drizzle-orm";
import _ from "lodash";

/**
 * Get basic query for quizzes / questions, not await / async incase we want
 * to chain off the result
 * @param {ReturnType<typeof drizzle>} db - drizzle db connection
 * @returns {Promise}
 */
const getBaseQuery = (db: ReturnType<typeof drizzle>) => {
  const nextQuestionQuery = aliasedTable(questions, "next");
  return db
    .select({
      id: questions.id,
      title: questions.title,
      description: questions.description,
      index: questions.index,
      quiz_id: questions.quiz_id,
      next: nextQuestionQuery.id,
    })
    .from(questions)
    .leftJoin(
      nextQuestionQuery,
      and(
        eq(questions.quiz_id, nextQuestionQuery.quiz_id),
        eq(questions.index, sql`next.index - 1`)
      )
    );
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
    const query = await getBaseQuery(db).where(eq(questions.id, req.params.id));
    if (_.isEmpty(query)) {
      res.status(StatusCodes.NOT_FOUND).json(null);
    }
    res.status(StatusCodes.OK).json(query[0]);
  }
}
