import express from "express";
import coreRoutes from "./core/routes";
import { prisma } from "../lib/prisma";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

// Prisma connection
prisma.$connect();

app.use(express.json());
app.use("/api", coreRoutes);

export default app;
