const mongoose=require('mongoose');
const bookingSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    paymentMethod:{
        type:String,
        enum:["cod","mpesa"],
        default:"cod"
       
       
    },
    paymentStatus:{
         type:String,
        enum:["pending","paid","failed"],
        default:"pending"

    },
    status:{
        type:String,
        enum:["pending","approved","completed"],
        default:"pending",

    },
    date:{
        type:Date,

        default:Date.now()
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true

    },
    deposit:{
        type:Number,
        required:true
    }

},{timestamps:true})

module.exports=mongoose.model("Booking",bookingSchema);