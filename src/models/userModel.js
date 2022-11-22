const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
     {
        name:{
           type:String,
           required:true
        },
        PhoneNumber: {
            type: String,
            required:true,
            unique: true
        },
        age:{
            type:Number,
            required: true
        },
        pincode: {
            type: Number,
            required: true,
            unique: true
        },
        aadharNo:{
            type: String,
            required: true
        },
        password: {
            type: String,
            required:true,
        }

    },{ timestamps: true }

 );

 module.exports = mongoose.model('User', userSchema);

