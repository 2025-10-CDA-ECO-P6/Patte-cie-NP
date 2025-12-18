import express from "express";
import coreRoutes from "./core/routes";
import { prisma } from "../lib/prisma";

const app = express();

// Prisma connection
prisma.$connect();

app.use(express.json());
app.use("/api", coreRoutes);

export default app;
