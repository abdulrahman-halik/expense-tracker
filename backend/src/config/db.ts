import mongoose from "mongoose";

const connectDB = async (): Promise<typeof mongoose> => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }

    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB runtime error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected");
    });

    // Fail fast within 5s if MongoDB container is not running or unreachable
    return mongoose.connect(uri, {
        dbName: 'expense-tracker',
        serverSelectionTimeoutMS: 5000,
    });
};

export default connectDB;
