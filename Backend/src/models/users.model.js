import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const usersSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        fullname:{
            type:String,
            required:true,
            unique:false,
        },
        email:{
            type:String,
            unique:true,
            required:true,
            lowercase:true,
            trim:true,
            index:true
        },
        phone:{
            type:String,
            unique:true,
        },
        passwordHash : {
            type:String,
            unique:true,
            required:true,
        },
    },
    {
        timestamps:true,
    },
)
     usersSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
    next();
  }),

  usersSchema.methods.isPasswordCorrect = async function (passwordHash) {
    return await bcrypt.compare(passwordHash, this.passwordHash);
  },
    usersSchema.methods.generateAccesstoken=function(){
        return jwt.sign(
            {
                _id:this.id,
                username:this.username,
                fullname:this.fullname,
                email:this.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
        )
    },
    usersSchema.methods.generateRefreshtoken=function(){
        return jwt.sign(
            {
                _id:this.id,
                username:this.username,
                fullname:this.fullname,
                email:this.email
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:REFRESH_TOKEN_EXPIRY}
        )
    }
export const User=mongoose.model("User",usersSchema);
