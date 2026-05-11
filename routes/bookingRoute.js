const express=require('express');
const {addNewBooking, getAllBookings, deleteBookings} = require('../controllers/bookingController');
const verifyUser = require('../middlewares/authMiddleware');
const bookingRouter=express.Router();
bookingRouter.post('/book/:id',verifyUser,addNewBooking);
bookingRouter.get('/get-bookings',verifyUser,getAllBookings);
bookingRouter.delete('/delete-bookings/:id',verifyUser,deleteBookings);



module.exports=bookingRouter;