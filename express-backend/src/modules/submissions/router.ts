import { Router } from "express";

import db from "../../db";
import { handlePost, handleGet } from "./handlers";
import { StatusCodes } from "http-status-codes";

const submissionRouter = Router();

// POST /api/submissions - create submission object
submissionRouter.post("/", async (req, res) => {
  try {
    await handlePost(req, res, db);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null);
  }
});

// GET /api/submissions/:id - Retrieve a single quiz result by ID
submissionRouter.get("/:id", async (req, res) => {
  try {
    await handleGet(req, res, db);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null);
  }
});

export default submissionRouter;
