
import userModal from "../models/userModel.js";
import messageModal from "../models/messageModel.js";

import { io, userSocketMap } from "../index.js";
import multer from "multer";
let getSideBarUser = async (req, res) => {
  try {
    let userId = req.user._id;
    let filteredUsers = await userModal
      .find({ _id: { $ne: userId } })
      .select("-password");
    let unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      let messages = await messageModal.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.send({
      status: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
};
let getMessages = async (req, res) => {
  try {
    let { id: selectedUserId } = req.params;
    let myId = req.user._id;
    let messages = await messageModal.find({
      $or: [
        { senderId: selectedUserId, receiverId: myId },
        { senderId: myId, receiverId: selectedUserId },
      ],
    });

    await messageModal.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { seen: true },
    );
    res.send({
      status: true,
      messages,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      message: error.message,
    });
  }
};
let markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params.id;
    await messageModel.findByIdAndUpdate(id, { seen: true });
    res.send({ status: true });
  } catch (error) {}
};
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP, and GIF images are allowed."), false);
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
});
let sendMessage = async (req, res) => {
  try {
    let { text } = req.body;
    let senderId = req.user._id;
    let receiverId = req.params.id;
    let image = "";
      let mimetype = "";
    let originalName = "";

    if (req.file) {
      image = req.file.buffer.toString("base64");
        mimetype = req.file.mimetype;
      originalName = req.file.originalname;
    }

    const newMessage = await messageModal.create({
      message: text?.trim() || "",
      senderId,
      receiverId,
      image ,
      mimetype,
      originalName
    });

    let receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.json({
      status: true,

      message: "Message Sent Auccessfully....",
      newMessage,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error,
    });
  }
};


export { getMessages, getSideBarUser, sendMessage, upload, markMessageAsSeen };
