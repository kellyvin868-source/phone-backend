const express=require('express');
const callBackRouter=express.Router();

callBackRouter.get('/',async(req,res)=>{
    try {

    res.send("Callback working");

        //const result=req.body;
        //console.log(result);
       // return res.status(200).json({
       //     ResultCode:0,
           // ResultDesc:"Accepted"
     //   })
        
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            sucess:false,
            message:error.message
        })
        
    }
})




module.exports=callBackRouter;