import User from "../model/user.ts";
import express from "express"
import jwt from "jsonwebtoken"
import type { NextFunction, Request, Response } from "express"

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized - No access token provided" })
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESSTOKEN!
      ) as { userId: string }

      const user = await User.findById(decoded.userId).select("-password")

      if (!user) {
        return res.status(401).json({ message: "User not found" })
      }

      req.user = user
      next()
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized - Access token expired" })
      }
      return res.status(401).json({ message: "Unauthorized - Invalid access token" })
    }
  } catch (error: any) {
    console.error("Error in protectRoute middleware:", error.message)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }

}