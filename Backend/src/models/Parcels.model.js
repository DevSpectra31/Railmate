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
        
    }
)