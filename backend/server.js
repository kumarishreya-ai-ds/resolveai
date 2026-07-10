import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("Current working directory:", process.cwd());
console.log("MONGODB_URI exists:", Boolean(process.env.MONGODB_URI));
if (process.env.MONGODB_URI) {
  const preview = process.env.MONGODB_URI.replace(/:(.*?)@/, ":***@");
  console.log("MONGODB_URI preview:", preview.slice(0, 25));
}

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ResolveAI Backend Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
