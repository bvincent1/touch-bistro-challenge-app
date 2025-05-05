import { Router } from "express";

import db from "../../db";
import { handlePost, handleGet } from "./handlers";

const submissionRouter = Router();

// POST /api/submissions - create submission object
submissionRouter.post("/", async (req, res) => {
  await handlePost(req, res, db);
});

// GET /api/submissions/:id - Retrieve a single quiz result by ID
submissionRouter.get("/:id", async (req, res) => {
  await handleGet(req, res, db);
});

export default submissionRouter;
