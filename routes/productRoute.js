const express=require('express');
const productRouter=express.Router();
const multer=require('multer');
const {storage}=require('../config/cloudinary');
const { addNewProduct, getAllProducts, getSingleProduct, deleteProduct } = require('../controllers/productController');
const upload=multer({storage:storage});

productRouter.post('/add',upload.single("file"),addNewProduct);
productRouter.get('/get',getAllProducts);
productRouter.get('/get/:id',getSingleProduct)
productRouter.delete('/delete/:id',deleteProduct)



module.exports=productRouter;