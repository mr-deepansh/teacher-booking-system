import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("Public"));
app.use(cookieParser());

// import Routes
import teacherRouter from "./routes/teacherRoutes.js";

// routes declaration
app.use("/api/v1/teacher", teacherRouter);

export { app };
