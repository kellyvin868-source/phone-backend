const express=require('express');
const { registerUser, loginUser, resetPassword, getUserData, loginAdmin } = require('../controllers/userController');
const {verifyUser,isAdmin} = require('../middlewares/authMiddleware');
const getAdminAccess = require('../middlewares/adMinMiddleware');
const useRouter=express.Router();

useRouter.post('/register',registerUser);
useRouter.post('/login',loginUser);
useRouter.post('/reset-password',resetPassword);
useRouter.get('/user-data',verifyUser,getUserData);
useRouter.post('/admin',loginAdmin);
useRouter.post('/very-admin',getAdminAccess,async(req,res)=>{
    const name="kelly"
    try {
        return res.status(200).json({
            success:true,
            message:"welcome to admin page",
            data:name
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
})






module.exports=useRouter;