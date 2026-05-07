const getToken = require("../config/mpesaToken");
const axios = require("axios");
const moment = require("moment");
const lipanaMpesa = async (req, res) => {
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  console.log(getToken());
  try {
    const { phone, amount } = req.body;
    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: "Phone number and amount are required!",
      });
    }

    const timestamp = moment().format("YYYYMMDDHHmmss");
    const token = await getToken();
    const password = Buffer.from(
      `${process.env.SHORTCODE}${process.env.PASSKEY}${timestamp}`,
    ).toString("base64");
    const response = await axios.post(
      url,
      {
        BusinessShortCode: process.env.SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.CallBackURL,
        AccountReference: "Kelvin Kemboi",
        TransactionDesc: "txndesc",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = lipanaMpesa;
