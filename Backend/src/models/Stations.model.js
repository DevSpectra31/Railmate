import mongoose ,{Schema} from "mongoose";
const StationSchema=new Schema(
    {
        station_code:{
            type:String,
            required:true,
            unique:true,
            index:true,
        },
        station_name:{
            type:String,
            required:true,
            unique:true,
            index:true,
        }
    }
)
export const Station=mongoose.model("Station",StationSchema);