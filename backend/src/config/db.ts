import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB");
        });

        // For Atlas URIs with query strings, it's better to include the DB name in the URI directly or pass it in options
        // Adding it before the query string if possible, or just using the URI as is if it contains the DB name.
        await mongoose.connect(uri, {
            dbName: 'expense-tracker'
        });
    } catch (error: any) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;

