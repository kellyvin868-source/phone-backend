const express=require('express');
const productRouter=express.Router();
const multer=require('multer');
const { addNewProduct, getAllProducts, getSingleProduct, deleteProduct } = require('../controllers/productController');
const storage=multer.memoryStorage();
const upload=multer({
    storage:storage,
    limits:{
        fileSize:10*1024*1024
    }
})

productRouter.post('/add',upload.single("file"),addNewProduct);
productRouter.get('/get',getAllProducts);
productRouter.get('/get/:id',getSingleProduct)
productRouter.delete('/delete/:id',deleteProduct)



module.exports=productRouter;