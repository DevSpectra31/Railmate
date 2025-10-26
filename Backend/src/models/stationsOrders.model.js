import mongoose,{Schema} from "mongoose";
const stationOrdersSchema=new Schema(
    {
        order_id:{
            typeo:String,
            unique:true,
            required:true,
        },
        items:[
            {
                Product_id:{
                    type:Schema.Types.ObjectId,
                    ref:"Products",
                },
                product_name:{
                    type:Schema.Types.ObjectId,
                    ref:"Products",
                },
                price:{
                    type:Schema.Types.ObjectId,
                    ref:"Products",
                },
            }
        ],
        order_status:{
            enum:["Pending","Preparing","Ready-for-pickup"],
            required:true,
        },
        Passenger_info:[
            {
                train_number:{
                    type:Schema.Types.ObjectId,
                    ref:"trains",
                },
                coach:{
                    
                }
            }
            
        ]
    }
)