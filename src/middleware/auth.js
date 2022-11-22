const jwt = require("jsonwebtoken");

const authentication = function (req, res, next) {

    try {
        const token = req.headers.authorization

        if (!token) {
        return res.status(400).send({ status: false, message: `Token Not Found` })}
            
        let splitToken = token.split(' ')

        let decodeToken = jwt.verify(splitToken[1], 'NJKBWD87128#@KJBKJHO')
    
        if (!decodeToken) {

        return res.status(401).send({ status: false, message: `Invalid Token` })}

        req.userId = decodeToken.userId

        next()


    } catch (error) {
        return res.status(500).send({ status: false, message: "Error", error: error.message })
    }
}

//AuthoriZation
const authorization = async function (req, res, next) {

    try {
        
        let userId = req.params.userId
        let decodeToken = req.decodeToken

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "invalid user Id" })
       
           if (decodeToken.userId == userId) 
           next()
           else return res.status(403).send({ status: false, message: "unauthorized.You are not authorize to perform the action." })

    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

module.exports.authentication = authentication
module.exports.authorization = authorization