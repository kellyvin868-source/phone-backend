require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectToDb = require("./config/db");
const useRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const mpesaRouter = require("./routes/mpesaRoute");

const PORT = process.env.PORT || 4000;
const app = express();

connectToDb();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use("/api/auth", useRouter);
app.use("/api/product", productRouter);
app.use("/api/mpesa", mpesaRouter);

app.listen(PORT, () => {
  console.log(`server is now running at http://localhost:${PORT}`);
});
