import express from "express";
import { connectDB } from "./lib/db.js";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import siteRoutes from "./routes/site.routes.js";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173", // local dev
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => res.send('server is running'));
app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/site", siteRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // make sure DB is connected first
    console.log("✅ MongoDB connected");

    // Import cron AFTER DB connection
    import('./configs/taskReminder.js');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

startServer();
