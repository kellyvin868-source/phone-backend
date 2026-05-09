const mongoose=require('mongoose');
const productShema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
   desc:{
        type:String,
        required:true
    },
    battery:{
        type:String,
        required:true
    },
    deposit:{
        type:Number,
        required:true
    },
    bestseller:{
        type:Boolean,
        default:false

    },
    camera:{
        type:String,
        required:true
    },
    storage:{
        type:String,
        trim:true
    },
    androidversion:{
        type:String,
        required:true
    },
    sim:{
        type:String,
        required:true
    },
    screen:{
        type:String,
        required:true
    },
    image:{
        type:Array,
        default:[]
    }

},{timestamps:true});

module.exports=mongoose.model("Product",productShema);