import mongoose from "mongoose";
import 'dotenv/config'
import dns from 'node:dns';

// Setting DNS servers to Google's to solve SRV record resolution issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectionDb = async () => {
    try {
        const URL = process.env.MONGODB_URL
        if (!URL) {
            throw new Error("MONGODB_URL environment variable is not defined");
        }

        await mongoose.connect(URL)
        console.log("Database connected sucessfully");

    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1)
    }
}

export default connectionDb