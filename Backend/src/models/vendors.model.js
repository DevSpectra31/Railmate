import mongoose,{Schema} from mongoose;
const vendorsSchema=new Schema(
    {
        ShopName:{
            type:String,
        },
        OwnerName:{
            type:String,
        },
        email:{
            type:String,
            unique:true,
            required:true,
            index:true,
            lowercase:true,
        },
        phone:{
            type:String,
            required:true,
            unique:true,
        },
        passwordHash:{
            type:String,
            required:true,
            unique:true
        },
        station_id:{
            type:Schema.Types.objectId,
            ref:"Stations",
        },
        platform_no:{
            type:Number,
            required:true,
        },
        
        shopNumber:{
            type:String,
            unique:true,
        },
        gstIn:{
            type:String,
            unique:true,
        },
        fssaiLicense :{
            type:String,
            unique:true,
        },
        description:{
            type:String,
            required:true,
        },
        isOpen:{
            type:Boolean,
            required:true,
        },
        OpeningHours:{
            type:String,
        },
        BankDetails:{
            AccountHolder:String,
            AccountNumber:String,
            iFSC_CODE : String,
            UPI : String,
        },
    },
    {timestamps:true}
);
export const Vendors=mongoose.model("Vendors",vendorsSchema);