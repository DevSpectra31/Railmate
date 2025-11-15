import mongoose ,{Schema} from "mongoose";
const ParcelSchema=new Schema(
    {
        user_id:{
            type:Schema.Types.ObjectId,
            ref:"USer",
        },
        order_id:{
            type:Schema.Types.ObjectId,
            ref:"Order",
        },
        amount:{
            type:Number,
            required:true,
            index:true,
        },
        paymentMode:{
            type:String,
            required:true,
        },
        paymentGateway_id:{
            type:String,
            unique:true,
            required:true,
        },
        status:{
            enum :['Success','Failed'],
            required:true,
        },
    },
    {timestamps:true},
)
export const Parcel=mongoose.model("Parcel",ParcelSchema);