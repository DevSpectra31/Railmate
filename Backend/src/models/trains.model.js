
import mongoose, { Schema } from "mongoose";

const trainsSchema = new Schema(
    {
        train_id:{
            type:String,
            unique:true,
            required:true,
        },
        train_Number:{
            type:Number,
            unique:true,
            required:true,
        },
        train_Name:{
            type:String,
            unique:true,
            required:true,
        },
        shedule:{
            station_id:{
                type:Schema.Types.ObjectId,
                ref:"Stations",
            },
            arrival_time:{
                type:String,
                required:true,
                unique:true,
            },
            deaparture_time:{
                type:String,
                required:true,
                unique:true,
            }
        },
        
    }
);
