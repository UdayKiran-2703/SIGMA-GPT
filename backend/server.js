import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/auth.js";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", authMiddleware(), chatRoutes); // protect chat routes

// app.post("/test", async (req, res) => {

// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURI);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("Not connected" + err);
  }
};
