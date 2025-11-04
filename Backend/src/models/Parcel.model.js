import mongoose ,{Schema, Types} from "mongoose";
const ParcelSchema=new Schema(
    {
        User_id:{
            type:Types.ObjectId,
            ref:"User",
        },
        fromStationID:{

        },
        ToStationID:{

        },
        Status:{
            type:String,
            enum ["BOOKEd","IN_TRANSIT","COLLECTED"],
        },
        
    }
)