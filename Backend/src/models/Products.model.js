import mongoose,{ Schema } from "mongoose";
const Productschema=new Schema(
    {
        vendor_id:{
            type:Schema.Types.ObjectId,
            ref:"Vendor"
        },
        vendor_name:{
            type:Schema.Types.ObjectId,
            ref:"Vendor",
        },
        product_name:{
            type:String,
            required:true,
        },
        Description:{
            type:String,
            required:true,
        },
        Category:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        },
        image_url:{
            type:String,
            required:true,
            //link to aws
        },
        isAvailiable:{
            type:Boolean,
            required:true,
        }
    },
    {timestamps:true}
)
export const Product=mongoose.model("Product",Productschema);
