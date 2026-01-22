import express from "express";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes";
import { prisma } from "../lib/prisma";
import { responseParser } from "./core/middlewares/responseParser.middleware";
import { errorParser } from "./core/middlewares/errorParser.middleware";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

prisma.$connect();

app.use(cookieParser());
app.use(express.json());
app.use(responseParser);
app.use("/api", apiRoutes);
app.use(errorParser);

export default app;
