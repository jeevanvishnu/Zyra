import User from "../model/user.ts";
import express from "express"
import jwt from "jsonwebtoken"
import type { Request, Response } from "express"

export const protectRoute = async (req:Request, res:Response , next) =>{

    try {
        const accessToken = req.cookies.accessToken
        if(!accessToken){
            return res.status(401).json({message:"Unauthorized - No access token provided"})
                
        }

        try {
            const decode = jwt.verify(accessToken,process.env.ACCESSTOKEN)
                const user = await User.findOne(decode.user.id).select('-password')

                if(!user){
                    return res.status(401).json({message:"User not found"})
                }
                req.user= user
                next()
                
        } catch (error) {
            if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			throw error;
        }
    } catch (error) {
       console.log("Error in protectRoute middleware", error.message);
		return res.status(401).json({ message: "Unauthorized - Invalid access token" }); 
    }
}