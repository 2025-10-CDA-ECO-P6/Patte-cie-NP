import { PrismaClient } from "@prisma/client";
import express from "express";
import coreRoutes from "./core/routes";


const app = express();

// Prisma connection
export const prisma = new PrismaClient();
prisma.$connect();

app.use(express.json());
app.use("/api", coreRoutes);

export default app;
