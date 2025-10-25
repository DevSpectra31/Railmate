import mongoose,{Schema} from mongoose;
const stationsSchema=new Schema(
    {
        stationCode:{
            type:String,
            unique:true,
            required:true,
            index:true,
        },
        stationName:{
            type:String,
            required:true,
            unique:true,
        },
        city:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        state:{
            type:true,
            required:true,
            unique:true,
            lowercase:true,
        },
        pincode:{
            type:String,
            required:true,
            required:true,
        },
        location:{
            type:PointerEvent,
            GeolocationCoordinates:[longitude,latitude]
        }
    }
)
export const Stations=m=mongoose.moddel("Stations",stationsSchema);