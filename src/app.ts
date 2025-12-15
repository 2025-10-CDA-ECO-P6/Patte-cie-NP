import express from "express";
import coreRoutes from "./core/routes";

const app = express();

app.use(express.json());
app.use("/api", coreRoutes);

export default app;
