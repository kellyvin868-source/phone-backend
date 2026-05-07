const jwt=require('jsonwebtoken');

const verifyUser=(req,res,next)=>{
    const headers=req.headers["authorization"];
    const token=headers && headers.split(" ")[1];
    if(!token){
        return res.status(404).json({
            success:false,
            message:"Access denied to this service or page due to no token found!"
        })
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user=decoded;
        next();
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }




}

const isAdmin=(req,res,next)=>{
    if(req.user.role!=='admin'){
        return res.status(400).json({
            success:false,
            message:'Admin rights are reserved!'
        })
    }
    next();
}

module.exports={verifyUser,isAdmin};