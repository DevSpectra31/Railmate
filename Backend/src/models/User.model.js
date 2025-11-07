import mongoose ,{Schema}from "mongoose";
const UserSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            index:true,
            trim:true,
        },
        name:{
            type:String,
            required:true,
        },
        mobile:{
            type:String,
            unique:true,
            required:true,
            index:true,
        },
        role:{
            type:String,
            enum : ["customer","staff","vendor"],
        },
        Profile:{
            type:String,
            // link to aws
        },
    },
    {timestamps:true}
)
export const User=mongoose.model("User",UserSchema);