import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import job from "../src/config/cron.js";

import connectDB from "../src/config/db.js";
import authRoutes from "../src/routes/authRoutes.js";
import bookRouters from "../src/routes/bookRoutes.js";

const app = express();

dotenv.config();
job.start();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRouters);

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
