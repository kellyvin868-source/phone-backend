const express = require("express");
const lipanaMpesa = require("../controllers/MpesaController");
const mpesaRouter = express.Router();
mpesaRouter.post("/stk", lipanaMpesa);

module.exports = mpesaRouter;
