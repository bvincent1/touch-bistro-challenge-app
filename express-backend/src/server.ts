import express, { json } from "express";
import { StatusCodes } from "http-status-codes";

import quizRouter from "./modules/quizzes/router";

const app = express();
app.use(json());

app.get("/api", (_req, res) => {
  res.status(StatusCodes.OK).send({ success: true });
});
app.use("/api/quizzes", quizRouter);

const port = Number(process.env.PORT);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
