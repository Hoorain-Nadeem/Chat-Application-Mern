
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userModal from "../models/userModel.js";

dotenv.config();
const profileMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token) {
      return res.status(401).send({
        status: false,
        message: "Unauthorized. Please login first.",
      });
    }

    let decoded = jwt.verify(
      token,
      process.env.SECRET_KEY
    );

    console.log("DECODED TOKEN:", decoded);

    let user = await userModal.findById(decoded.id);

    if (!user) {
      return res.status(401).send({
        status: false,
        message: "User not found",
      });
    }

    req.user = user;

    console.log("REQ.USER:", req.user);

    next();
  } catch (error) {
    console.log("AUTH MIDDLEWARE ERROR:", error);

    return res.status(401).send({
      status: false,
      message: "Invalid or expired token",
    });
  }
};

export default profileMiddleware;