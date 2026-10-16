import React, { useContext, useState } from "react";
import Sidebar from "../Components/Sidebar";
import ChatContainer from "../Components/ChatContainer";
import RightSidebar from "../Components/RightSidebar";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Home = () => {
  const { selectedUser } = useContext(ChatContext);
  return (
    <div className="h-screen w-full overflow-hidden border sm:px-[15%] sm:py-[5%]">
      <div
        className={`relative grid  h-full min-h-0 grid-cols-1 overflow-hidden rounded-2xl border-2 border-gray-600 backdrop-blur-xl ${
          selectedUser
            ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
            : "md:grid-cols-2"
        }`}
      >
        <Sidebar />

        <ChatContainer />

        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
