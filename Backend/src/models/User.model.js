import mongoose , {Schema} from "mongoose";
const UserSchema=new Schema(
    {
        Username:{
            type:String,
            unique:true,
            required:true,
        },
        email:{
            type:String,
            unique:true,
            required:true,
        },
        name:{
            type:String,
            required:true,
        },
        mobile:{
            type:String,
            unique:true,
            required:true,
        },
        Role:{
            type:String,
            enum : ["Customer","staff","Vendor"],
            required:true,
        },
        Profile_img:{
            type:String,
            //upload on AWS
        }
    }
)
export const User=mongoose.model("User",UserSchema);