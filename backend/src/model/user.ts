import mongoose, { Schema } from 'mongoose'

interface userData {
    name: string,
    password: string,
    email: string,
    refreshToken: string,
    role: string,
    cartItems: {
        product: mongoose.Types.ObjectId,
        quantity: number
    }[]
}

const userSchema = new Schema<userData>({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String
    },
    role: {
        type: String,
        enum: ["admin", "customer"],
        default: 'customer'
    },
    cartItems: [
        {
            quantity: {
                type: Number,
                default: 1,
            },
            product: {
                type: Schema.Types.ObjectId,
                ref: "Products",
            },
        },
    ],
}, { timestamps: true })

const User = mongoose.model("User", userSchema)


export default User