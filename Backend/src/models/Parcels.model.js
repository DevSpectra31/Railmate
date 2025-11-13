import mongoose,{Schema} from "mongoose";
const ParcelSchema=new Schema(
    {
        user_id:{
            type:Schema.Types.ObjectId,
            ref:"User",
        },
        station_id:{
            type:Schema.Types.ObjectId,
            ref:"Station",
        },
        fromStation_id:{
            type:Schema.Types.ObjectId,
            ref:"Station",
        },
        Recipient_mobile:{
            type:String,
            required:true,
            unique:true,
        },
        weight:{
            type:Schema.Types.ObjectId,
            ref:"Product",
        },
        status:{
            enum : ["in-transit","delivered","cancelled"],
            required:true,
        },
    },
    {timestamps:true}
)
export const Parcel=mongoose.model("Parcel",ParcelSchema);