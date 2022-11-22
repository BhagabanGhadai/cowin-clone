const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId


const bookSlotSchema = new mongoose.Schema(
     {  
        userId: {
            type: ObjectId,
            refs: 'User',
            required: true 
        },
        doseType: {
            type: String,
            required: true,
            enum: [ "First", "Second"]
           },
        slotDate:{
            type:String,
            required:true
        },
        slotTime: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum:["pending", "completed", "cancelled"],
            default: "pending"
        }

    },{ timestamps: true }

 );

 module.exports = mongoose.model('bookedSlot',bookSlotSchema);