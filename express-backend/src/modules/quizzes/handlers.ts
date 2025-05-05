import { Request, Response } from "express";
import { type drizzle } from "drizzle-orm/node-postgres";
import { StatusCodes } from "http-status-codes";
import { eq, sql, lt } from "drizzle-orm";
import _ from "lodash";

import { quizzes } from "./models";
import { questions } from "../questions/models";
import { submissions } from "../submissions/models";
import { ArrayElement } from "../../libs/types";

/**
 * Get basic query for quizzes / questions, not await / async incase we want
 * to chain off the result
 * @param {ReturnType<typeof drizzle>} db - drizzle db connection
 * @returns {Promise}
 */
const getBaseQuery = (db: ReturnType<typeof drizzle>) => {
  const subs = db
    .select({
      question_id: submissions.question_id,
      count: sql<number>`cast(count(${submissions.id}) as int)`.as("count"),
    })
    .from(submissions)
    .groupBy(submissions.question_id)
    .as("subs");

  return db
    .select({
      id: quizzes.id,
      title: quizzes.title,
      description: quizzes.description,
      question: questions,
    })
    .from(quizzes)
    .leftJoin(questions, eq(quizzes.id, questions.quiz_id))
    .leftJoin(subs, eq(subs.question_id, questions.id))
    .where(lt(subs.count, 3))
    .$dynamic();
};

type RowResult = ArrayElement<Awaited<ReturnType<typeof getBaseQuery>>>;
/**
 * Reduce query results into a single nested object
 * @param {{}} final
 * @param {RowResult} r
 * @returns
 */
export const reducerFunction = (final: {}, r: RowResult) => {
  if (!_.has(final, r.id)) {
    _.set(final, r.id, {
      id: r.id,
      title: r.title,
      description: r.description,
      questions: [],
    });
  }

  if (r.question) {
    _.set(
      final,
      `${r.id}.questions`,
      _.sortBy(
        _.concat(_.get(final, `${r.id}.questions`, []), r.question),
        "index"
      )
    );
  }
  return final;
};

/**
 * Handle express GET "/api/quizzes" by querying module data, and formatting it.
 * Converts flat quiz objects into nested `{quizzes.$inferSelect & { questions: questions.$inferSelect[] }}[]` objects
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {ReturnType<typeof drizzle>} db - drizzle db object
 *
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
    // reduce directly on [db.query] to keep types
    const results = query.reduce(reducerFunction, {});

    res.status(StatusCodes.OK).json(Object.values(results));
  }
}

/**
 * Handle express GET "/api/quizzes/:id"
 * Converts flat data into nested data like [handleGetAll]
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
    const query = await getBaseQuery(db).where(eq(quizzes.id, req.params.id));

    // reduce directly on [db.query] to keep types
    const results = query.reduce(reducerFunction, {});
    const quiz = Object.values(results)[0];
    if (_.isEmpty(quiz)) {
      res.status(StatusCodes.NOT_FOUND).json(null);
    }
    res.status(StatusCodes.OK).json(quiz);
  }
}
