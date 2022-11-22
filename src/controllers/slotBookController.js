const slotBookModel = require('../models/slotBookModel');
const vaccineSlotModel = require('../models/vaccineSlotModel');
const userModel = require("../Models/userModel");
const validator = require('../validation/validator')

/**********************************************************Get Slots***************************************************/
const getSlot = async function (req, res) {
    try {

        let slotDetails = req.query

        slotDetails.availableSlot = { $gt: 0 }

        let availableSlots = await vaccineSlotModel.find(filter).select({ _id: 0, slotDate: 1, slotTime: 1, totalSlot: 1, bookedSlot: 1, availableSlot: 1 })

        if (availableSlots && availableSlots.length === 0) {
            return res.status(404).send({ status: false, message: "No slot avaliable" })
        }

        return res.status(200).send({ status: true, message: "Showing All The Available Slots", slots: availableSlots })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}


/**************************************************************Slot Booking****************************************** */

const slotBook = async function (req, res) {
    try {
        let userId = req.params.userId
        let slotDetails = req.body

        const { doseType, slotDate, slotTime } = slotDetails

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid UserId" })
        }

        const findUser = await userModel.findOne({ _id: userId })

        if (!findUser) {
            return res.status(404).send({ status: false, message: "User Not found" })
        }

        if (!validator.isValidRequestBody(slotDetails)) {
            return res.status(400).send({ status: false, message: "Please chose the slot details" })
        }

        if (!validator.isValid(doseType)) {
            return res.status(400).send({ status: false, message: 'Select Dose(First,Second)' })
        }

        if (!["First", "Second"].includes(doseType)) {
            return res.status(400).send({ status: false, message: 'chose First Or Second' })
        }

        if (!validator.isValid(slotDate)) {
            return res.status(400).send({ status: false, message: 'Select Date' })
        }

        if (!validator.isValid(slotTime)) {
            return res.status(400).send({ status: false, message: 'Select Time' })
        }

        const getSlots = await vaccineSlotModel.findOne({ slotDate: slotDate, slotTime: slotTime })
        const availableSlot = getSlots.availableSlot

        if (availableSlot === 0) {
            return res.status(404).send({ status: false, message: "No Slots Available! Try Later" })
        }

        let findBooking = await slotBookModel.findOne({ userId: userId, doseType: doseType });

        if (!findBooking) {
            if (doseType == "Second") {
                let checkForFirst = await slotBookModel.findOne({ userId: userId });

                if (checkForFirst && checkForFirst.status == "pending" && checkForFirst.doseType == "First") {
                    return res.status(400).send({ status: false, message: `${checkForFirst.doseType} Dose is Alloted to You ! please Go the nearest center on scheduled date` })
                }

                if (checkForFirst && checkForFirst.status == "cancelled" && checkForFirst.doseType == "First") {
                    return res.status(400).send({ status: false, message: `${checkForFirst.doseType} Dose is cancelled please take ${checkForFirst.doseType} Dose first` })
                }
            }

            await slotBookModel.create(slotDetails)
        } else {
            if (findBooking && findBooking.status == "pending") {
                return res.status(400).send({ status: false, message: `${doseType} Dose is Alloted to You ! please Go the nearest center on scheduled date` })
            }

            if (findBooking && findBooking.status == "completed") {
                return res.status(400).send({ status: false, message: `You are Already Vaccinated By ${doseType} Dose` })
            }
            if (findBooking && findBooking.status == "cancelled") {
                await slotBookModel.findOneAndUpdate({ _id: findBooking._id, userId },
                    { $set: { status: "pending" } },
                    { new: true });
            }
        }

        await vaccineSlotModel.findOneAndUpdate({ _id: getSlots._id },
            { $set: { bookedSlot: getSlots.bookedSlot + 1, availableSlot: getSlots.availableSlot - 1 } },
            { new: true })

        return res.status(201).send({ status: true, message: "slot booking successfull" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


/**********************************************************************Cancel The Booking************************************ */
//user only cancelled the booking

const cancelBooking = async function (req, res) {

    try {

        let userId = req.params.userId;
        let bookingId = req.body.bookingId

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid UserId" })
        }

        const findUser = await userModel.findOne({ _id: userId })

        if (!findUser) {
            return res.status(404).send({ status: false, message: "User Not found" })
        }

        if (!validator.isValid(bookingId)) {
            return res.status(400).send({ status: false, message: "Enter The Slot Book Id" });
        }

        if (!validator.isValidObjectId(bookingId)) {
            return res.status(400).send({ status: false, message: "Invalid slotBookId" })
        }

        let findBooking = await slotBookModel.findOne({ _id: bookingId, userId: userId });

        if (!findBooking)
            return res.status(404).send({ status: false, message: "No Booked Slot Found", });

        if (findBooking && findBooking.status == "cancelled")
            return res.status(400).send({ status: false, message: "cant modify!! Dose is already cancelled", })

        if (findBooking && findBooking.status == "complected")
            return res.status(400).send({ status: false, message: "cant modify !! Dose is already complected", })

        if (findBooking && findBooking.status == "pending") {
            let updatedBooking = await slotBookModel.findOneAndUpdate({ _id: bookingId, userId },
                { $set: { status: "cancelled" } },
                { new: true });

            const getSlots = await vaccineSlotModel.findOne({ slotDate: findBooking.slotDate, slotTime: findBooking.slotTime })

            await vaccineSlotModel.findOneAndUpdate({ _id: getSlots._id },
                { $set: { bookedSlot: getSlots.bookedSlot - 1, availableSlot: getSlots.availableSlot + 1 } },
                { new: true })

            return res.status(200).send({ status: true, message: "slot updated successfully ", data: updatedBooking });
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}




module.exports = { getSlot, slotBook, cancelBooking }