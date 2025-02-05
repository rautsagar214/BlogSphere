import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import blogRoutes from "./routes/blogRoutes.js";
import authRoutes from "./routes/auth.js"

dotenv.config();

const app = express();
const port = 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(authRoutes)

// Routes
app.use("/api/blogs", blogRoutes);

// Connect to MongoDB

console.log(process.env.DB_URI)
mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
