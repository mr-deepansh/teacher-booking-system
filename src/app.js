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

// Import Routes
import teacherRouter from "./routes/teacher.routes.js";
import appointmentRouter from "./routes/appiontment.routes.js";
import studentRouter from "./routes/student.routes.js";
import departmentRouter from "./routes/department.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";

// Routes declaration
app.use("/api/v1/teacher", teacherRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/department", departmentRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/feedback", feedbackRouter);

export { app };
