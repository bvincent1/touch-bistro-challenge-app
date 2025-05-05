import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import db from "../../db";
import { handleGet, handleGetAll } from "./handlers";

const quizRouter = Router();

// GET /api/quizzes - Retrieve all test objects
quizRouter.get("/", async (req, res) => {
  try {
    await handleGetAll(req, res, db);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null);
  }
});

// GET /api/quizzes/:id - Retrieve a single test object by ID
quizRouter.get("/:id", async (req, res) => {
  try {
    await handleGet(req, res, db);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null);
  }
});

export default quizRouter;
