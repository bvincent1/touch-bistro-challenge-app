import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import db from "../../db";
import { handleGet, handleGetAll } from "./handlers";

const quizRouter = Router();

// GET /api/quizzes - Retrieve all test objects
quizRouter.get("/", async (req, res) => {
  await handleGetAll(req, res, db);
});

// GET /api/quizzes/:id - Retrieve a single test object by ID
quizRouter.get("/:id", async (req, res) => {
  await handleGet(req, res, db);
});

export default quizRouter;
