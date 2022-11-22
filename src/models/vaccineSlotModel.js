const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
     {
        slotDate:{
            type:String,
            required: true,
        },
        slotTime: {
            type: String,
            required: true
        },
        totalSlot: {
            type: Number,
            required:true
        },
        bookedSlot: {
            type: Number,
            default:0,
        },
        availableSlot: {
            type: Number,
            default:10,
        }

    },{ timestamps: true }

 );

 module.exports = mongoose.model('slot', slotSchema);