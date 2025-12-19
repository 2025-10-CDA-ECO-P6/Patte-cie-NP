import express from "express";
<<<<<<< HEAD
import coreRoutes from "./core/routes";
import { prisma } from "../lib/prisma";
import cookieParser from "cookie-parser";
=======
import apiRoutes from "./routes";
import {prisma} from "../lib/prisma"
import { responseParser } from "./core/middlewares/responseParser.middleware";
import { errorParser } from "./core/middlewares/errorParser.middleware";
>>>>>>> 14cd20d0d44d46a63f89ac55c7d6c96570174219

const app = express();
app.use(cookieParser());

// Prisma connection
prisma.$connect();

app.use(express.json());
app.use(responseParser);
app.use("/api", apiRoutes);
app.use(errorParser);

export default app;
