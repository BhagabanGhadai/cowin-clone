const userModel = require("../Models/userModel");
const validator = require('../validation/validator')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const signUp = async function (req, res) {
    try {
        let userData = req.body

        const { name, phoneNumber, age, pincode, aadharNo, password } = userData;

        if (!validator.isValidRequestBody(userData)) {
            return res.status(400).send({ status: false, message: "Please enter Valid User Details" })
        }
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: "Enter Your Name" })
        }
        if (!validator.isValid(phoneNumber)) {
            return res.status(400).send({ status: false, message: "Enter Your phoneNumber" });
        }

        if (!validator.isValidNumber(phoneNumber)) {
            return res.status(400).send({ status: false, message: "please enter a valid phoneNumber" });
        }

        let isPhoneNumberUnique = await userModel.findOne({ phoneNumber })

        if (isPhoneNumberUnique) {
            return res.status(400).send({ status: false, message: "phoneNumber is already exist,please try another" });
        }

        if (!validator.isValid(age)) {
            return res.status(400).send({ status: false, message: "Enter Your Age" });
        }

        if (age <= 0) return res.status(400).send({ status: false, message: "Age is not valid,Enter valid Age" })

        if (!validator.isValid(pincode)) {
            return res.status(400).send({ status: false, message: "Enter Your Pincode" });
        }

        if (!validator.isValidPincode(pincode)) {
            return res.status(400).send({ status: false, message: "pincode is invalid,enter Correct Pincode" });
        }

        if (!validator.isValid(aadharNo)) {
            return res.status(400).send({ status: false, message: "Enter Your aadharNo" });
        }

        if (!validator.isValidAadharCard(aadharNo)) {
            return res.status(400).send({ status: false, message: "AadharNo. is not valid,Enter Your 12 Digit Aadhar Number" });
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "Enter Your Password" });
        }

        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "password must be 8-15 characters" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        userData.password = hashedPassword

        let createUser = await userModel.create(saveData)
        return res.status(201).send({ status: true, message: "SignUp Successful", data: createUser });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


/**********************************************************LogIn********************************************************/

const login = async function (req, res) {
    try {
        let loginDetails = req.body

        const{phoneNumber,password}=loginDetails

        if (!validator.isValidRequestBody(loginDetails)) {
            return res.status(400).send({ status: false, message: "Please enter Valid User Details" })
        }

        if (!validator.isValid(phoneNumber)) {
            return res.status(400).send({ status: false, message: "Enter Your phone Number" });
        }

        if (!validator.isValidNumber(phoneNumber)) {
            return res.status(400).send({ status: false, message: "please enter valid phone number" });
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "Enter Your Password" });
        }

        const findUserFromDB = await userModel.findOne({ phoneNumber })

        if (!findUserFromDB) {
            return res.status(404).send({ status: false, message: "No User Found! Enter Registered Phone Number" });
        }

        const passwordMatch = await bcrypt.compare(password, findUserFromDB.password);

        if (!passwordMatch) {
            return res.status(400).send({ status: false, message: "You have Entered Wrong Password" });
        }

        let userId = checkedUser._id.toString()
        let token = jwt.sign({
            userId: userId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
        }, 'NJKBWD87128#@KJBKJHO');

        return res.status(200).send({ status: true, message: "login sucessfull", data: token })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: "Error", error: error.message })
    }
}



module.exports = { signUp, login }