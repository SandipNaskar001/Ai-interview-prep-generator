const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../model/blacklist.model");

async function authUser(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found",
      });
    }

    const isTokenBlacklisted = await tokenBlackListModel.findOne({ token });

    if (isTokenBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

module.exports = { authUser };