import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
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
        password:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim : true,
        },
        mobile:{
            type:String,
            unique:true,
            required:true,
            index:true,
        },
        role:{
            type:String,
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
Userschema.pre("save",async function name(next) {
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
});
Userschema.methods.isPasswordCorrect=async function(password) {
    return await bcrypt.compare(password,this.password);
}
Userschema.methods.isMobileCorrect=async function(mobile) {
    return await bcrypt.compare(mobile,this.mobile)
}
Userschema.methods.generateAccessToKen=function(){
    return jwt.sign(
        {
            _id:this.id,
            username:this.username,
            name:this.name,
            email:this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
    );
};
Userschema.methods.generateRefreshToKen=function(){
    return jwt.sign(
        {
            _id:this.id,
            username:this.username,
            name:this.name,
            email:this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
    );
};