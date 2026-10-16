
import mongoose from "mongoose";
import user from "../models/userModel.js";
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user,
      required: true,
    },
    message: {
      type: String,
    },

    image: {
      type: String,
      default: "",
    },
    mimetype: {
      type: String,
      default: "",
    },
    originalName: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// module.exports = mongoose.model("Message", messageSchema);
const messageModal = mongoose.model("Message", messageSchema);

export default messageModal;
