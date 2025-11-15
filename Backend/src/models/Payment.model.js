import mongoose ,{Schema} from "mongoose";
const PaymentSchema=new Schema(
    {
        user_id:{
            type:Schema.Types.ObjectId,
            ref:"User",
        },
        order_id:{
            type:Schema.Types.ObjectId,
            ref:"Order",
        },
        amount:{
            type:Schema.Types.ObjectId,
            ref:"Parcel",
        },
        PaymentMode:{
            type:Schema.Types.ObjectId,
            ref:"Parcel",
        },

    },
    {timestamps:true}
)
export const Payment=mongoose.model("Payment",PaymentSchema);