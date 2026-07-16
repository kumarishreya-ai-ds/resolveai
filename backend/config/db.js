import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    const uri = process.env.MONGODB_URI?.trim();
    const isProductionLike = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);

    if (uri) {
      const preview = uri.replace(/:(.*?)@/, ":***@");
      console.log("MONGODB_URI preview:", preview.slice(0, 25));

      try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected");
        return;
      } catch (error) {
        if (isProductionLike) {
          throw error;
        }
        console.warn("Primary MongoDB URI failed; continuing without fallback in local mode:", error.message);
        return;
      }
    }

    console.log("MONGODB_URI not set; skipping database connection in local mode.");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
