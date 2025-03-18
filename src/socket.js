import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
    autoConnect: true, // Automatically connect when imported
    reconnectionAttempts: 3, // Retry if it fails
    timeout: 5000, // Wait up to 5s before failing
  });

export default socket;