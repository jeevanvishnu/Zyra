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
    }[],
    wishlist: mongoose.Types.ObjectId[],
    addresses: {
        _id?: string,
        street: string,
        city: string,
        state: string,
        zipCode: string,
        country: string,
        phone: string,
        isDefault: boolean
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
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Products",
        },
    ],
    addresses: [
        {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: true },
            isDefault: { type: Boolean, default: false }
        }
    ]
}, { timestamps: true })

const User = mongoose.model("User", userSchema)


export default User