import express from "express";
import "dotenv/config"
import cookieParser from "cookie-parser"
import connectionDb from "./lib/db.ts";
import cors from "cors"
import authRoutes from './routes/auth.route.ts'
import '../src/lib/passport.ts'
import passport from 'passport';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(passport.initialize())
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 3000
const start = () => {
  connectionDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    })
  });
};


start()