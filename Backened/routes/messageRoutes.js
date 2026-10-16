
import express from "express";

import profileMiddleware from "../middleware/authMiddleware.js";

import {
  getSideBarUser,
  getMessages,
  sendMessage,
  markMessageAsSeen,
} from "../controller/messageController.js";

import { upload } from "../controller/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", profileMiddleware, getSideBarUser);
messageRouter.get("/message/:id", profileMiddleware, getMessages);
messageRouter.put("/mark/:id", profileMiddleware, markMessageAsSeen);

messageRouter.post(
  "/send/:id",
  profileMiddleware,
  upload.single("image"),
  sendMessage
);
export default messageRouter;
