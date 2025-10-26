import mongoose ,{Schema} from {mongoose};
const productSchema=new Schema(
    {
        Product_id:{
            type:String,
            unique:true,
            required:true,
        },
        Vendor_id:{
            type:Schema.Types.objectId,
            ref:"Vendors"
        },
        Station_id:{
            type:Schema.Types.objectId,
            ref:"Stations",
        },
        product_name:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            index:true,
        },
        description:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        },
        category :{
            type:String,
            required:true,
            enum:["Food","Books","Beverages","Tea","Electronic item"],
        },
        isVeg:{
            type:Boolean,
            required:true,
        },
        imageUrl:{
            type:String,
            required:true,
        },
        stock:{
            type:String,
            required:true,
        },
        isAvialiabe:{
            type:Boolean,
        },
    },
    {timestamps:true},
)
export const Product=mongoose.model("Products",productSchema);
