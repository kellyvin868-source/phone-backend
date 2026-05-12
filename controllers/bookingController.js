const Booking = require("../models/bookingModel");
const User = require("../models/userModel");
const Product = require("../models/productsModel");
const getToken = require("../config/mpesaToken");
const moment = require("moment");
const axios = require("axios");

const addNewBooking = async (req, res) => {
  function validateKenyanPhone(main) {
    let p = main.replace(/\s+/g, "").replace("+", "");

    if (/^0[17]\d{8}$/.test(p)) p = "254" + p.slice(1);
    else if (/^[17]\d{8}$/.test(p)) p = "254" + p;
    else if (!/^254[17]\d{8}$/.test(p)) return null;

    return p;
  }

  try {
    const { phone, address, paymentMethod } = req.body;

    if (!phone || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    const validPhone = validateKenyanPhone(phone);
    if (!validPhone) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }
    const userId = req.userId;
    const { id } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with id not found!",
      });
    }
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product with the id not found!",
      });
    }

    const existingBooking = await Booking.findOne({
      user: userId,
      product: id,
    });
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this product!",
      });
    }

    const alreadyBooking = await Booking.findOne({
      user: userId,
      status: { $in: ["pending", "approved"] },
    });

    if (alreadyBooking) {
      return res.status(400).json({
        message: "You already have an active booking",
      });
    }

    const booking = new Booking({
      user: userId,
      product: id,
      deposit: product.deposit,
      phone: validPhone,
      address,
      paymentMethod,
    });

    await booking.save();

    if (paymentMethod === "mpesa") {
      initiateStkPush(booking.deposit, booking.phone, booking._id);
    }

    return res.status(200).json({
      sucess: true,
      message: "Phone booked successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const initiateStkPush = async (amount, phone, id) => {
    const url =
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const token = await getToken();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(
      `${process.env.SHORTCODE}${process.env.PASSKEY}${timestamp}`,
    ).toString("base64");

    const response = await axios.post(url, {
      BusinessShortCode: process.env.SHORTCODE,
      Password:password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB:process.env.SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.CallBackURL,
      AccountReference: id,
      TransactionDesc: "txndesc",
    },{
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"application/json"
      }
      
    });

    console.log(response.data);

  
};
const getAllBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await Booking.find({ user: userId })
      .populate("user", "name email")
      .populate("product");
    if (bookings.length > 0) {
      return res.status(200).json({
        success: true,
        message: "All bookings retrieved successfully!!",
        bookings,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "'You have not book any phone,,please make a booking!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const user = await Booking.find({ user: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with booking not found,,invalid access",
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking with the id not found",
      });
    }

    const deleted = await Booking.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully!",
      data: deleted,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { addNewBooking, getAllBookings, deleteBookings };
