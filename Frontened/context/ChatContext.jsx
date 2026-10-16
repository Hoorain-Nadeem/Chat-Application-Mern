import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useEffect } from "react";
import Swal from "sweetalert2";
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [unSeenMessages, setUnseenMessages] = useState({});
  const { axios, socket } = useContext(AuthContext);

 
 
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/chat/users", {
        withCredentials: true,
      });

      if (data.status) {
        setUsers(data.users);
        console.log(users);
        setUnseenMessages(data.unseenMessages || {});
        console.log(unSeenMessages);
      }
    } catch (error) {
      console.error("Get users error:", error.response?.data || error.message);

      Swal.fire({
        icon: "error",
        title: "Failed to load users",
        text: error.response?.data?.message || error.message,
        confirmButtonColor: "#14b8a6",
        background: "#111119",
        color: "#ffffff",
      });
    }
  };
  let getMessages = async (userId) => {
    try {
      let { data } = await axios.get(`/api/chat/message/${userId}`, {
        withCredentials: true,
      });
      setMessages(data.messages);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message,
        confirmButtonColor: "#14b8a6",
        background: "#111119",
        color: "#ffffff",
      });
    }
  };

  let sendMessage = async (messageData) => {
    try {
      let { data } = await axios.post(
        `/api/chat/send/${selectedUser._id}`,
        messageData,
        {
          withCredentials: true,
        },
      );
      if (data.status) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        Swal.fire({
          icon: "error",
          title: data.message,
          confirmButtonColor: "#14b8a6",
          background: "#111119",
          color: "#ffffff",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message,
        confirmButtonColor: "#14b8a6",
        background: "#111119",
        color: "#ffffff",
      });
    }
  };

  let subscribeToMessges = () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/chat/mark/${newMessage._id}`,{}, {
          withCredentials: true,
        });
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessges();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);
  const value = {
    messages,
    users,
    selectedUser,
    setMessages,
    getMessages,
    sendMessage,
    setSelectedUser,
    unSeenMessages,
    setUnseenMessages,
    getUsers,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
