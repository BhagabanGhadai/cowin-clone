const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId


const bookSlotSchema = new mongoose.Schema(
     {  
        userId: {
            type: ObjectId,
            required: true, 
            refs: 'User'
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