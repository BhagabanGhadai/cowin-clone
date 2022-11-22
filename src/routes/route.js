const express=require('express')
const router=express.Router()

const {authentication}=require('../middleware/auth')
/*for user */
const {signUp,login}=require('../controllers/userController')
router.post('/signup',signUp)
router.post('/login',login)

const {getSlot,slotBook,cancelBooking}=require('../controllers/slotBookController')
router.get('/slot',getSlot)
router.post('/booking/:userId',slotBook)
router.put('/booking/:userId',cancelBooking)

/*for Admin */
const {createSlot}=require('../controllers/adminController')
router.post('/slot/:adminId',createSlot)

module.exports = router;