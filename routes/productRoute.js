const express = require("express");
const productRouter = express.Router();
const multer = require("multer");
const {
  addNewProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
} = require("../controllers/productController");
const getAdminAccess = require("../middlewares/adMinMiddleware");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null,file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

productRouter.post("/add", upload.array("files",5),getAdminAccess, addNewProduct);
productRouter.get("/get", getAllProducts);
productRouter.get("/get/:id", getSingleProduct);
productRouter.delete("/delete/:id",getAdminAccess, deleteProduct);

module.exports = productRouter;
