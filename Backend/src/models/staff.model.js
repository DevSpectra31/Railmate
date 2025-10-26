import mongoose,{Schema} from "mongoose";
const StaffSchema=new Schema(
    {
        staff_id:{
            type:String,
            unique:true,
            required:true,
            index:true,
        },
        first_Name:{
            type:String,
            required:true,
        },
        Last_Name:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            unique:true,
            required:true,
            index:true,
        },
        passwordHash:{
            type:String,
            unique:true,
            required:true,
        },
        role:{
            type:String,
            enum:['Admin','ParcelClerk','StationManager','Support'],
        },
        persmissions:{
            manage:"parcels",
            view:"analytics",
        },
        isActive:{
            type:Boolean,
        },

    },
    {timestamps:true},
)
export const Staff=mongoose.model("Staff",StaffSchema);