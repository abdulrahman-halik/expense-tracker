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


        await mongoose.connect(uri, {
            dbName: 'expense-tracker'
        });
    } catch (error: any) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;

