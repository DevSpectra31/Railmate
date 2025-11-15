import mongoose, {Schema} from "mongoose";
const Vendorschema=new Schema(
    {
        vendor_name:{
            type:String,
        },
        shop_name:{
            type:String,
            required:true,
        },
        image:{
            type:String,
            //upload to aws
        },
        platform:{
            type:Number,
            required:true,
            index:true,
        },
    },
    {timestamps: true}
)
export const Vendor=mongoose.model("Vendor",Vendorschema);
