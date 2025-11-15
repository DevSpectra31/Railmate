import mongoose , {Schema} from "mongoose";
const StationSchema=new Schema(
    {
        Station_code:{
            type:String,
            required:true,
            unique:true,
        },
        station_name:{
            type:String,
            required:true,
        },
        train_number:{
            type:Number,
            unique:true,
            required:true,
        },
        coach_no:{
            type:String,
            unique:true,
            required:true,
        },
        sit_number:{
            type:Number,
            unique:true,
            required:true,
            },
        platform:{
            type:Number,
            unique:true,
            required:true,
        }
    },
    {timestamps:true}
)
export const Station=mongoose.model("Station",StationSchema);
