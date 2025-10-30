import mongoose ,{Schema} from "mongoose";
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
            required:true,
            unique:true,
        },
        passwordHash : {
            type:String,
            unique:true,
            required:true,
        },
         "addresses": [
    {
      "tag": "String", // e.g., 'Home', 'Work'
      "street": "String",
      "city": "String",
      "state": "String",
      "pincode": "String",
      "isDefault": "Boolean"
    }
  ]
    },
    {
        timestamps:true,
    }
);
export const User=mongoose.model("User",usersSchema);
