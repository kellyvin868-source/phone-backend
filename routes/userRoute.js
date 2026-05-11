const express=require('express');
const { registerUser, loginUser, resetPassword, getUserData, loginAdmin } = require('../controllers/userController');
const verifyUser= require('../middlewares/authMiddleware');
const getAdminAccess = require('../middlewares/adMinMiddleware');
const useRouter=express.Router();

useRouter.post('/register',registerUser);
useRouter.post('/login',loginUser);
useRouter.post('/reset-password',resetPassword);
useRouter.get('/user-data',verifyUser,getUserData);
useRouter.post('/admin',loginAdmin);


module.exports=useRouter;