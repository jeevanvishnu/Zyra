import User from "../model/user.ts"
import { generateToken } from "../lib/generateToken.ts"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import type { Request, Response } from "express"


const setCookies = (res:Response , accessToken:string , refreshToken:string) =>{
    res.cookie("accessToken",accessToken,{
        httpOnly: true, 
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", 
		maxAge: 15 * 60 * 1000, 
    }),
    
    res.cookie("refreshToken",refreshToken,{
        httpOnly: true, 
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", 
		maxAge: 15 * 60 * 1000, 
    })
}

export const login = async (req: Request, res: Response) =>{
    try {
    const {email , password} = req.body

    const user = await User.findOne({email})

    if(!user){
        return res.status(404).json({message:"User doesn't exist. please signup"})
    }
    
    const checkPassword = await bcrypt.compare(password,user?.password)

    if(!checkPassword){
        return res.status(500).json({message:"password doesn't match"})
    }
    
    const {accessToken , refreshToken} = generateToken(user._id)
    setCookies(res , accessToken , refreshToken)
    

    res.status(200).json({message:"Login sucessfully"})
    }catch (error) {
        console.log("error is from login",error);
        res.status(500).json({message:"Internal server error"})
    }
}

export const signup = async (req:Request , res:Response)=>{
    try{
        const {name , email , password} = req.body
        
        const user = await User.findOne({email})
        if(user) {
            return res.status(409).json({message:"User already exists"})
        }   
        if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
        }

        const hassedPassword = await bcrypt.hash(password,10)

        const newUser = new User({
            name:name,
            password:hassedPassword,
            email:email,
        })
        

        const {accessToken , refreshToken} = generateToken(newUser._id)
        setCookies(res , accessToken , refreshToken)

        newUser.refreshToken = refreshToken
        await newUser.save()

        res.status(201).json({message:"signup sucessfully completed"})
    }catch(err){
        console.log("Error is form signup",err);
        res.status(500).json({message:"Internal server error"})
    }
}

export const logout = async (req:Request , res:Response) =>{
    try{
     
       res.clearCookie("accessToken")
       res.clearCookie('refreshToken')
       res.json({message:"Logout sucessfull"})
    }catch(err){
        console.log("The error is from logout",err)
        res.status(500).json({message:"internal server error"})
    }

}

export const refreshToken = async (req:Request , res:Response) =>{
    try{
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(403).json({message:"Token not found"})
    }
    
    const decode = jwt.verify(refreshToken , process.env.REFRESHTOKEN)

    const user = await User.findById(decode.userId)

    if(!user || refreshToken !==  user?.refreshToken ){
        return res.status(403).json({message:"Invaild refresh token"})
    }
    
    const newAccessToken = generateToken(user.id);

    res.json({ accessToken: newAccessToken })

}catch(err){
     return res.status(403).json({ message: "Refresh token expired" });
}
  } 
    
