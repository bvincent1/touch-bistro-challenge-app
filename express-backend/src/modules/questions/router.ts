import { Router } from "express";

import { handleGet, handleGetAll } from "./handlers";
import db from "../../db";

const questionRouter = Router();

// GET /api/quizzes - Retrieve all test objects
questionRouter.get("/", async (req, res) => {
  await handleGetAll(req, res, db);
});

// GET /api/quizzes/:id - Retrieve a single test object by ID
questionRouter.get("/:id", async (req, res) => {
  await handleGet(req, res, db);
});

export default questionRouter;
