const User=require('../models/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const validator=require('validator');



const registerUser=async(req,res)=>{
    try {
        const{name,email,password,role}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required!!"

            })
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({
                success:false,
                message:'Please enter a valid email address!'
            })
        }

        const isExistingEmail=await User.findOne({email});
        if(isExistingEmail){
            return res.status(400).json({
                success:false,
                message:'Email already exists,please login'
            })
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const user=new User({
            name,
            email,
            password:hashedPassword,
            role:role
        })
        await user.save();

        const token=jwt.sign({userId:user._id,name:user.name,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:"7d"})

        return res.status(200).json({
            success:true,
            message:"Registered successfully!!",
            token
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}

const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required!!"
            })
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"Email not found!!"
            })
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(404).json({
                success:false,
                message:"Invalid password!"
            })
        }

        const token=jwt.sign({userId:user._id,name:user.name,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:"7d"})

        return res.status(200).json({
            success:true,
            message:"Login successfully!!",
            token
        })
        

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}

const resetPassword=async(req,res)=>{
    try {
        const {newPass,email}=req.body;
        if(!newPass || !email){
            return res.status(400).json({
                success:false,
                message:"All fields are required!!"
            })
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:'Email  not found,please enter your registered email'
            })
        }

        const salt=await bcrypt.genSalt(10);
        const ChangedPass=await bcrypt.hash(newPass,salt);
        user.password=ChangedPass;
        await user.save();


        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}

const getUserData=async(req,res)=>{
    try {
        const userId=req.userId;
        const user=await User.findById(userId);
        return res.status(200).json({
            success:true,
            data:{
                email:user.email,
                name:user.name,
                role:user.role
                
            }

        })
    
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}

const loginAdmin=async(req,res)=>{
   try {

     const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:'All fields are required!'
        })
    }
    if(email !== process.env.ADMIN_EMAIL){
        return res.status(404).json({
            success:false,
            message:"Email not found!"
        })

    }

    if(password !== process.env.ADMIN_PASSWORD){
        return res.status(404).json({
            success:false,
            message:'Invalid password'
        })
    }

    const token=jwt.sign({email:email},process.env.JWT_SECRET_KEY,{expiresIn:"7d"});
    return res.status(200).json({
        success:true,
        message:"Login successfully",
        token
    })
    
   } catch (error) {

    console.error(error);
    return res.status(500).json({

        success:false,
        message:error.message
    })
    
   }

}




module.exports={
    registerUser,
    loginUser,
    resetPassword,
    getUserData,
    loginAdmin
}