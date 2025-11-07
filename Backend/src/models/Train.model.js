import mongoose ,{Schema} from "mongoose";
const TrainSchema=new Schema(
    {
    Train_number:{
        type:Number,
        required:true,
        unique:true,
        index:true,
    },
    Coach_number:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    Sit_number:{
        type:Number,
        required:true,
        unique:true,
        index:true,
    }
}
)
export const Train=mongoose.model("Train",TrainSchema);