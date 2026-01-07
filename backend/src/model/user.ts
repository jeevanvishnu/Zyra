import mongoose, { Schema } from 'mongoose'

interface userData {
    name:string,
    password:string,
    email:string,
    refreshToken:string
}

const userSchema = new Schema<userData>({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    refreshToken:{
        type:String
    },
},{timestamps:true})

const User = mongoose.model("User",userSchema)


export default User