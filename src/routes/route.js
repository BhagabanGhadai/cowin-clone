const express=require('express')
const router=express.Router()

const {authentication,authorization}=require('../middleware/auth')
/*for user */
const {signUp,login}=require('../controllers/userController')
router.post('/signup',signUp)
router.post('/login',login)

const {getSlot,slotBook,cancelBooking}=require('../controllers/slotBookController')
router.get('/slot',getSlot)
router.post('/book/:userId',authentication,authorization,slotBook)
router.put('/book/:userId',authentication,authorization,cancelBooking)

/*for Admin */
const {createSlot,adminGetUserdata}=require('../controllers/adminController')
router.post('/slot',authentication,createSlot)
router.get('/user',adminGetUserdata)

module.exports = router;