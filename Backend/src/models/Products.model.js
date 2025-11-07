import mongoose ,{Schema} from "mongoose";
const ProductSchema=new Schema(
    {
        vendor_id:{
            type:Schema.Types.ObjectId,
            ref:"Vendors",
        },
        description:{
            type:String,
            required:true,
        },
        category:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true,
            index:true,
        },
        imagURL:{
            type:String
            // link to aws
        },
        isAvailiable:{
            type:Boolean,
            required:true,
            index:true,
        }
    },
    {timestamps:true}
)
export const Product=mongoose.model("Product",ProductSchema);
