const mongoose = require('mongoose')


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false 
    if (typeof value === 'string' && value.trim().length === 0) return false 
    return true;
};

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0; 
};


const validString = function (value) {
    if (typeof value === 'string' && value.trim().length === 0) return false 
    return true;
}

const isValidNumber= function (phoneNumber) {                                                              
    return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(phoneNumber)
};

const isValidPincode=function (pincode){
    return (/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/).test(pincode)
}

const isValidAadharCard=function(aadharNo){
    return /^[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}$/.test(aadharNo)
}

module.exports = { isValid, isValidObjectId,isValidRequestBody, validString ,isValidNumber,isValidPincode,isValidAadharCard}