import mongoose from "mongoose";
import config from "config";
import dotenv from "dotenv";

dotenv.config();
const db = process.env.MONGO_URI || config.get('mongoURI');
const connectDatabase = async () => {
    try {
        await mongoose.connect(db);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
export default connectDatabase;