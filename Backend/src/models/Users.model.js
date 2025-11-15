import mongoose ,{Schema} from "mongoose";
const Userschema=new Schema(
    {
        username :{
            type:String,
            unique:true,
            required:true,
            index:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            index:true,
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
            enum :["Customer","Staff","Vendor"],
            reuired:true,
        },
        verified:{
            type:Boolean,
            required:true,
        }
    },
    {timestamps:true}
)
export const User=mongoose.model("User",Userschema);