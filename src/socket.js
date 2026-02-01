import { io } from "socket.io-client";

// Always connect to your backend (port 8000)
const socket = io("http://192.168.0.241:8000", {
  autoConnect: false,
});

export default socket;
