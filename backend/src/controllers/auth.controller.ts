import User from "../model/user.ts"
import { generateToken } from "../lib/generateToken.ts"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import type { Request, Response } from "express"


const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Lax for OAuth compatibility
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Lax for OAuth compatibility
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "User doesn't exist. please signup" })
        }

        const checkPassword = await bcrypt.compare(password, user?.password)

        if (!checkPassword) {
            return res.status(500).json({ message: "password doesn't match" })
        }

        const { accessToken, refreshToken } = generateToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        setCookies(res, accessToken, refreshToken);

        res.status(200).json({ _id: user._id, email: user.email, name: user.name, role: user.role, message: "Login successfully" })
    } catch (error) {
        console.log("error is from login", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        const user = await User.findOne({ email })
        if (user) {
            return res.status(409).json({ message: "User already exists" })
        }
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const hassedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name: name,
            password: hassedPassword,
            email: email,
        })


        const { accessToken, refreshToken } = generateToken(newUser._id)
        setCookies(res, accessToken, refreshToken)

        newUser.refreshToken = refreshToken
        await newUser.save()

        res.status(201).json({ message: "signup sucessfully completed" })
    } catch (err) {
        console.log("Error is form signup", err);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const logout = async (req: Request, res: Response) => {
    try {

        res.clearCookie("accessToken")
        res.clearCookie('refreshToken')
        res.json({ message: "Logout sucessfull" })
    } catch (err) {
        console.log("The error is from logout", err)
        res.status(500).json({ message: "internal server error" })
    }

}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(403).json({ message: "Token not found" })
        }

        const decode = jwt.verify(refreshToken, process.env.REFRESHTOKEN)

        const user = await User.findById(decode.userId)

        if (!user || refreshToken !== user?.refreshToken) {
            return res.status(403).json({ message: "Invaild refresh token" })
        }

        const { accessToken, refreshToken: newRefreshToken } = generateToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save();

        setCookies(res, accessToken, newRefreshToken);

        res.json({ message: "Token refreshed successfully" });

    } catch (err) {
        return res.status(403).json({ message: "Refresh token expired" });
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try {
        res.json(req.user)

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById((req as any).user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = await bcrypt.hash(req.body.password, 10);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const authGoogleCallback = async (req: Request, res: Response) => {
    try {
        const { displayName, emails } = req.user as any;
        const email = emails?.[0]?.value;

        if (!email) {
            return res.redirect("http://localhost:5173/login?error=GoogleAuthNoEmail");
        }

        let user = await User.findOne({ email });

        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await User.create({
                name: displayName || "User",
                email: email,
                password: hashedPassword,
            });
        }

        const { accessToken, refreshToken } = generateToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        setCookies(res, accessToken, refreshToken);

        res.redirect("http://localhost:5173");
    } catch (error) {
        console.log("Error in google callback", error);
        res.redirect("http://localhost:5173/login");
    }
}
