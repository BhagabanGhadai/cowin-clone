const slotModel = require("../models/vaccineSlotModel");
const userModel = require("../Models/userModel");
const validator = require('../validation/validator');
const vaccineSlotModel = require("../models/vaccineSlotModel");
const slotBookModel = require("../models/slotBookModel");



const createSlot = async function (req, res) {

    try {

        let adminId = req.params.adminId
        let vaccineSlotDetails = req.body

        const { slotDate, slotTime, totalSlot } = vaccineSlotDetails;

        if (!validator.isValid(slotDate)) {
            return res.status(400).send({ status: false, message: "Enter the slotDate" });
        }

        if (!validator.isValid(slotTime)) {
            return res.status(400).send({ status: false, message: "Enter the slotTime" });
        }
        if (!validator.isValid(totalSlot)) {
            return res.status(400).send({ status: false, message: "Entet Total Number Of Slots" });
        }

        if (!validator.isValidObjectId(adminId)) {
            return res.status(400).send({ status: false, message: "Invalid Admin Id" })
        }

        const findAdmin = await userModel.findOne({ _id: userId })

        if (!findAdmin) {
            return res.status(404).send({ status: false, message: "Admin Not found" })
        }

        let createSlot = await slotModel.create(vaccineSlotDetails)

        return res.status(201).send({ status: true, message: "Slot created successfully", data: createSlot });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


const adminGetUserdata = async function (req, res) {
    try {

        let filter = req.query
        const {age,pincode,st}=filter
       if(validator.isValid(filter.status)){
        let registredUserVaccineStatus = await slotBookModel.find(filter.status)
    }
    let registredUser = await userModel.find(filter)
       
        if (avaliableSlot && avaliableSlot.length === 0)
            return res.status(404).send({ status: false, message: "No slot avaliable" })

        return res.status(200).send({ status: true, message: "slot list accessed successfully", data: avaliableSlot })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}


module.exports= {createSlot}

