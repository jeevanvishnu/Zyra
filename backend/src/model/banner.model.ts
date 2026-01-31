import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
    title: string;
    description?: string;
    image: string;
    link?: string;
    isActive: boolean;
    location: string;
    createdAt: Date;
    updatedAt: Date;
}

const BannerSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    link: { type: String },
    isActive: { type: Boolean, default: true },
    location: { type: String, default: "homepage" }
}, { timestamps: true });

export const Banner = mongoose.model<IBanner>("Banner", BannerSchema);
