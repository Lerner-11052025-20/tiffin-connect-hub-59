import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "https://tiffin-connect-backend.onrender.com";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
