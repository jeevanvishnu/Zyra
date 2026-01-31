import express from "express";
import "dotenv/config"
import cookieParser from "cookie-parser"
import connectionDb from "./lib/db.ts";
import cors from "cors"
import authRoutes from './routes/auth.route.ts'
import productRoutes from './routes/admin/products.routes.ts'
import '../src/lib/passport.ts'
import passport from 'passport';
import userProduct from "./routes/user/product.route.ts"
import cartRoutes from "./routes/user/cart.route.ts"
import wishlistRoutes from "./routes/user/wishlist.route.ts"
import orderRoutes from "./routes/user/order.route.ts"
import adminOrderRoutes from "./routes/admin/order.route.ts"
import webhookRoutes from "./routes/user/webhook.route.ts"
import userRoutes from "./routes/user/user.route.ts"
const app = express();

app.use(express.json({
  verify: (req: any, res, buf) => {
    if (req.originalUrl.startsWith('/api/orders/webhook')) {
      req.rawBody = buf;
    }
  }
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(passport.initialize())
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/orders/webhook', webhookRoutes)
app.use('/api/admin/orders', adminOrderRoutes)
app.use('/api/products', productRoutes)
app.use('/api', userProduct)

const PORT = process.env.PORT || 3000
const start = () => {
  connectionDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    })
  });
};


start()