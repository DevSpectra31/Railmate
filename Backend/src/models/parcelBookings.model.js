import mongoose, { Schema, Types } from 'mongoose';
const parcelSchema = new Schema(
    {
        Parcel_id: {
            type: String,
            unique: true,
            required: true,
        },
        User_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
        booking_id: {
            type: String,
            unique: true,
            required: true,
        },
        sender: [
            {
                name: {
                    type:String,
                    required:true,
                },
                phone:{
                    type:String,
                    required:true
                },
                address:[
                    {
                        name:{
                            type:String,
                            required:true,
                        },
                        phone:{
                            type:String,
                            required:true,
                        },
                        address:[
                            {
                                shop_name:{
                                    type:Schema.Types.ObjectId,
                                    ref:"Vendors",
                                    required:true,
                                },
                                shop_no:{
                                    type:Schema.Types.ObjectId,
                                    ref:"Vendors",
                                    required:true,
                                },
                                stationCode:{
                                    type:Schema.Types.ObjectId,
                                    ref:"Stations",
                                },
                                platform_no:{
                                    type:Schema.Types.ObjectId,
                                    ref:"Vendors",
                                }

                            }
                        ]
                    }
                ]
            }
        ],
        recipent :[
            {
                name: {
                    type:String,
                    required:true,
                },
                phone:{
                    type:String,
                    required:true
                },
                address:[
                    {
                        train_no:{
                            type:Schema.Types.ObjectId,
                            ref:"Trains"
                        },
                        train_name:{
                            type:Schema.Types.ObjectId,
                            ref:"Trains",
                        },
                        coach_no:{
                            type:Number,
                            required:true,
                        },
                        sit_no:{
                            type:Number,
                            required:true,
                            unique:true,
                        }
                    }
                ]
            }
        ],
        parcel_details:[
            {
                weight:{
                    type:Number,
                    required:true,
                },
                dimensions:{
                    type:Number,
                    required:true,
                },
                category:{
                    type:Schema.Types.ObjectId,
                    ref:"Product",
                }
            }
        ],
        cost:[
            {
                base_fare:{
                    type:Number,
                    required:true,
                },
                gst:{
                    type:Number,
                    required:true,
                },
                total:{
                    type:Number,
                    required:true,
                }
            }
        ],
        payment_id:{
            type:String,
            unique:true,
            required:true,
        },
        payment_status:{
            enum:["Success","Pennding","Failed"],
            required:true,
        },
        booking_status:{
            enum :["Booked","In-Transit","Delivered"],
            required:true,
        },
        qrCodeUrl:{
            type:String,
            required:true,
            unique:true,
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('ParcelBooking', parcelSchema);