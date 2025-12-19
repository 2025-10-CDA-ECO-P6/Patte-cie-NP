import express from "express";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes";
import { prisma } from "../lib/prisma"
import { responseParser } from "./core/middlewares/responseParser.middleware";
import { errorParser } from "./core/middlewares/errorParser.middleware";

const app = express();

prisma.$connect();

app.use(cookieParser());
app.use(express.json());
app.use(responseParser);
app.use("/api", apiRoutes);
app.use(errorParser);

export default app;
