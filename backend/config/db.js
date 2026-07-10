import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    const uri = process.env.MONGODB_URI?.trim();
    if (uri) {
      const preview = uri.replace(/:(.*?)@/, ":***@");
      console.log("MONGODB_URI preview:", preview.slice(0, 25));

      try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected");
        return;
      } catch (error) {
        console.warn("Primary MongoDB URI failed; falling back to local MongoDB:", error.message);
      }
    } else {
      console.log("MONGODB_URI not set; using local MongoDB fallback.");
    }

    mongoServer = await MongoMemoryServer.create();
    const fallbackUri = mongoServer.getUri();
    await mongoose.connect(fallbackUri);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
