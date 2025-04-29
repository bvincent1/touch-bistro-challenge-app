import express, { Request, Response, NextFunction, json } from "express";
import { StatusCodes } from "http-status-codes";

const app = express();

const logRequestMethod = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.method);
  next();
};
const logHostname = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.hostname);
  next();
};

app.use(logRequestMethod);
app.use(logHostname);
app.use(json());

app.get("/api", (_req, res) => {
  res.status(StatusCodes.OK).send({ success: true });
});

const port = Number(process.env.PORT) || 9001;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
