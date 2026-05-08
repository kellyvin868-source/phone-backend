const jwt = require("jsonwebtoken");
const getAdminAccess = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(404).json({
      success: false,
      message: "Access denied due to No token found!",
    });
  }

  try {
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(decoded.email !== process.env.ADMIN_EMAIL){
        return res.status(400).json({
            success:false,
            message:'Access denied,only admins can post a product'
        })
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = getAdminAccess;
