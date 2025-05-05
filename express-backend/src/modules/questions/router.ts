import { Router } from "express";

import { handleGet, handleGetAll } from "./handlers";
import db from "../../db";
import { StatusCodes } from "http-status-codes";

const questionRouter = Router();

// GET /api/quizzes - Retrieve all test objects
questionRouter.get("/", async (req, res) => {
  try {
    await handleGetAll(req, res, db);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null);
  }
});

// GET /api/quizzes/:id - Retrieve a single test object by ID
questionRouter.get("/:id", async (req, res) => {
  try {
    await handleGet(req, res, db);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null);
  }
});

export default questionRouter;
