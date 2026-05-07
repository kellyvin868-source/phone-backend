const express=require('express');
const { registerUser, loginUser, resetPassword, getUserData, accessAdmin, loginAdmin } = require('../controllers/userController');
const {verifyUser,isAdmin} = require('../middlewares/authMiddleware');
const useRouter=express.Router();

useRouter.post('/register',registerUser);
useRouter.post('/login',loginUser);
useRouter.post('/reset-password',resetPassword);
useRouter.get('/user-data',verifyUser,getUserData);
useRouter.post('/admin',loginAdmin);






module.exports=useRouter;