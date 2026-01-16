import mongoose, { Schema } from "mongoose"

interface productInterface  {
    ProductName:string,
    stock:number,
    price:number,
    category:string,
    description:string,
    isActive:boolean
}

const ProductsModel = new Schema<productInterface>({
    ProductName:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:false
    }
},{timestamps:true})


export const Products = mongoose.model("Products",ProductsModel)