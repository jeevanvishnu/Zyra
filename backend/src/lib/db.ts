import mongoose from "mongoose";
import 'dotenv/config'

const connectionDb  = async () =>{
    try {
        const URL = process.env.MONGODB_URL
        if (!URL) {
            throw new Error("MONGODB_URL environment variable is not defined");
        }
        await mongoose.connect(URL)
        console.log("Database connected sucessfully");
        
    } catch (error) {
        console.log("Database connection failed",error);
        process.exit(1)
    }
}

export default connectionDb