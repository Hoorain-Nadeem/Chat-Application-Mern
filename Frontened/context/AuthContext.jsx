// import { createContext } from "react";
// import axios from "axios";
// const backenedUrl = import.meta.env.VITE_BACKENED_URL;
// axios.defaults.baseURL = backenedUrl;
// export const AuthContext = createContext();
// import Swal from "sweetalert2";
// import { useEffect } from "react";
// import { io } from "socket.io-client";
// import { useState } from "react";

// export const AuthProvider = ({ children }) => {
//   const [authUser, setAuthUser] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const [token, setToken] = useState(null);

//   let checkAuth = async () => {
//     try {
//       const { data } = await axios.get("/api/user/check");
//       if (data.status) {
//         setAuthUser(data.user);
//         connectSocket(data.user);
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: error.message,
//         confirmButtonColor: "#14b8a6",
//         background: "#111119",
//         color: "#ffffff",
//       });
//     }
//   };

//   const login = async (email,password) => {
//     try {
//       const { data } = await axios.post("/api/user/login", {email,password}, { withCredentials: true });
//       if (data.status) {
//         setAuthUser(data.User);
//         connectSocket(data.User);
//         Swal.fire({
//           icon: "success",
//           title: data.message,
//           confirmButtonColor: "#14b8a6",
//           background: "#111119",
//           color: "#ffffff",
//         });
//            return true;
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "errore",
//         title: error.message,
//         confirmButtonColor: "#14b8a6",
//         background: "#111119",
//         color: "#ffffff",
//       });
//          return false;
//     }
//   };

//   const logout = async () => {
//     try {
//       const { data } = await axios.post("/api/user/logout"  ,  {},
//       { withCredentials: true });
//       if (data.status) {
//         setAuthUser(null)
//         // checkAuth(null);
//         setOnlineUsers([]);
//         socket.disconnect();
//         Swal.fire({
//           icon: "success",
//           title: data.message,
//           confirmButtonColor: "#14b8a6",
//           background: "#111119",
//           color: "#ffffff",
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "errore",
//         title: error.message,
//         confirmButtonColor: "#14b8a6",
//         background: "#111119",
//         color: "#ffffff",
//       });
//     }
//   };
//   const register = () => {
//     const { data } = axios.post("/api/user/register");
//     if (data.status) {
//       return data;
//     }
//   };
//   const connectSocket = async (userData) => {
//     if (!userData || socket?.connected) return;
//     const newSocket = io(backenedUrl, {
//       query: {
//         userId: userData._id,
//       },
//     });
//     newSocket.connect();
//     setSocket(newSocket);
//     newSocket.on("getOnlineUsers", (userIds) => {
//       setOnlineUsers(userIds);
//     });
//   };
//   const value = {
//     axios,
//     authUser,
//     onlineUsers,
//     socket,
//     login,
//     logout,
//     register,
//   };
//   useEffect(() => {
  
//     checkAuth
//   }, []);
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };```jsx
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { io } from "socket.io-client";

const backenedUrl = import.meta.env.VITE_BACKENED_URL;

axios.defaults.baseURL = backenedUrl;
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(null);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/user/check", {
        withCredentials: true,
      });

      if (data.status) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.error(
        "Authentication check failed:",
        error.response?.data || error.message
      );
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        { withCredentials: true }
      );

      if (data.status) {
        setAuthUser(data.User);
        connectSocket(data.User);

        Swal.fire({
          icon: "success",
          title: data.message,
          confirmButtonColor: "#14b8a6",
          background: "#111119",
          color: "#ffffff",
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);

      Swal.fire({
        icon: "error",
        title: error.response?.data?.message || "Login failed",
        confirmButtonColor: "#14b8a6",
        background: "#111119",
        color: "#ffffff",
      });

      return false;
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(
        "/api/user/logout",
        {},
        { withCredentials: true }
      );

      if (data.status) {
        socket?.disconnect();
        setSocket(null);
        setAuthUser(null);
        setOnlineUsers([]);

        Swal.fire({
          icon: "success",
          title: data.message,
          confirmButtonColor: "#14b8a6",
          background: "#111119",
          color: "#ffffff",
        });
      }
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await axios.post(
        "/api/user/register",
        formData,
        { withCredentials: true }
      );

      return data;
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      return false;
    }
  };

  const connectSocket = (userData) => {
    if (!userData?._id) return;

    // Avoid opening another connection for the same user.
    if (socket?.connected) return;

    const newSocket = io(backenedUrl, {
      query: {
        userId: userData._id,
      },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection failed:", error.message);
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    setSocket(newSocket);
  };

  useEffect(() => {
    checkAuth();

    return () => {
      socket?.disconnect();
    };
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

