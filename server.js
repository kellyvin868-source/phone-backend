require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectToDb = require("./config/db");
const useRouter = require("./routes/userRoute");
const productRouter=require('./routes/productRoute');
const bookingRouter=require('./routes/bookingRoute');
const callBackRouter=require('./routes/callBackRoute');


const PORT = process.env.PORT || 4000;
const app = express();

connectToDb();

// CORS configuration for both local and production
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  "https://vercel.app", // Allow all Vercel deployments
  // Add specific Vercel URLs
].filter(Boolean); // Remove undefined values

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowedOrigins or matches Vercel domain
      if (allowedOrigins.includes(origin) || origin.includes("vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for origin: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth", useRouter);
app.use("/api/product",productRouter);
app.use('/api',bookingRouter);
app.use('/api/mpesa/callback',callBackRouter);



app.listen(PORT, () => {
  console.log(`server is now running at http://localhost:${PORT}`);
});
