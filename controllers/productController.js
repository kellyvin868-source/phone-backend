const Product=require('../models/productsModel');
const cloudinary =require('../config/cloudinary');

const addNewProduct=async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:"Please upload a file!!"
            })
        }

        const {name,desc,deposit,camera,bestseller,storage,battery,androidversion,sim,screen}=req.body;
        if(!name || !storage || !desc || !deposit ||  !camera || !battery || !androidversion || !sim || !screen){
            return res.status(400).json({
                success:false,
                message:"All fields are required!!"
            })
        }


        const result=await cloudinary.uploader.upload(req.file.path);
        const newProduct=new Product({
            name,
            desc,
            deposit,
            battery,
            camera,
            androidversion,
            sim,
            screen,
            bestseller:bestseller?"true":"false",
            storage,
            image:result.secure_url,
            publicId:result.public_id
         
        });

        await newProduct.save();
        return res.status(200).json({
            success:true,
            message:"Product added successfully!",
            data:newProduct
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}

const getAllProducts=async(req,res)=>{
    try {
        const products=await Product.find({}).sort({createdAt:-1});
        if(products.length<1){
            return res.status(404).json({
                success:false,
                message:'No products available at the moment!'
            })
        }
        return res.status(200).json({
            success:true,
            data:products
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}

const getSingleProduct=async(req,res)=>{
    try {
        const id=req.params.id;
        const product=await Product.findById(id);
        if(!product){
            return res.status(404).json({
                success:false,
                message:'Product with the id not found!'
            })
        }
        return res.status(200).json({
            success:true,
            product
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}

const deleteProduct=async(req,res)=>{
    try {
        const id=req.params.id;
        const product=await Product.findById(id);
        if(!product){
            return res.status(404).json({
                success:false,
                message:'Product with the id not found'
            })
        }

        const deleted=await Product.findByIdAndDelete(product);
        return res.status(200).json({
            success:true,
            message:'Product deleted successfully!',
            data:deleted
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}


module.exports={addNewProduct,getAllProducts,getSingleProduct,deleteProduct};