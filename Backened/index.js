

import express from "express";
import cors from "cors";
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
dotenv.config()

import userRouter from "./routes/userRoutes.js"
import messageRouter from "./routes/messageRoutes.js"



const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());





const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("User connected:", userId, socket.id);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);

    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

app.use("/api/user", userRouter);
app.use("/api/chat", messageRouter);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Database connected");
    server.listen(process.env.PORT || 5000, () => {
      console.log("Server running");
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

export default app ;
