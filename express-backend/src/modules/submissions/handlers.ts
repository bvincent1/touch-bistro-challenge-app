import e, { Request, Response } from "express";
import { type drizzle } from "drizzle-orm/node-postgres";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { submissions } from "./models";
import { questions } from "../questions/models";
import { eq, and, sql } from "drizzle-orm";
import _ from "lodash";

/**
 * Create submission object, always responds (200, boolean)
 * @param {Request} req
 * @param {Response} res
 * @param {ReturnType<typeof drizzle>} db
 */
export async function handlePost(
  req: Request,
  res: Response,
  db: ReturnType<typeof drizzle>
): Promise<void> {
  const questionData = await db
    .select()
    .from(questions)
    .where(eq(questions.id, req.body.question_id));

  // question not found
  if (questionData.length === 0) {
    res.status(StatusCodes.OK).json(false);
    return;
  }

  const question = questionData[0];
  const prevSubmissions = await db
    .select()
    .from(submissions)
    .where(eq(submissions.question_id, req.body.question_id));

  // handle submit count > 3 or submitted correct answer already
  if (
    prevSubmissions.length >= 3 ||
    _.some(prevSubmissions, (s) => s.answer === question.correct_answer)
  ) {
    res.status(StatusCodes.OK).json(false);
    return;
  }

  try {
    await db.insert(submissions).values(
      z
        .object({
          answer: z.string(),
          question_id: z.string(),
          user: z.string(),
        })
        .parse({ ...req.body, user: req.headers["quiz-user"] })
    );
  } catch (error) {
    // probably a parsing error
    console.error(error);
    res.status(StatusCodes.OK).json(false);
    return;
  }

  res
    .status(StatusCodes.OK)
    .json(question.correct_answer === _.get(req, "body.answer", NaN));
}

export async function handleGet(
  req: Request,
  res: Response,
  db: ReturnType<typeof drizzle>
): Promise<void> {
  if (!req.headers["quiz-user"]) {
    res.status(StatusCodes.NOT_FOUND).json(null);
  } else {
    try {
      const results = await db
        .select({ count: sql<number>`cast(count(${questions.id}) as int)` })
        .from(questions)
        .leftJoin(submissions, and(eq(submissions.question_id, questions.id)))
        .where(
          and(
            eq(questions.quiz_id, req.params.id),
            eq(questions.correct_answer, submissions.answer)
          )
        );

      res.status(StatusCodes.OK).json({
        correct_answers: results.length === 0 ? 0 : results[0].count,
      });
    } catch (error) {
      console.error(error);
      // can't return actual server state
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null);
    }
  }
}
