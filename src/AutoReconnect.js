// // src/components/AutoReconnect.js
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import socket from './socket';

// const AutoReconnect = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const stored = localStorage.getItem("kiraly-autoreconnect");
//     if (!stored) return;

//     const { name, gender, gameID } = JSON.parse(stored);

//     socket.auth = { playerName: name };
//     if (!socket.connected) socket.connect();

//     socket.emit("checkGameStatus", { gameID }, (response) => {
//       if (response?.error || response?.gameEnded || !response?.hasStarted) {
//         localStorage.removeItem("kiraly-autoreconnect");
//         navigate("/");
//         return;
//       }

//     socket.emit("joinGameRoom", {
//         gameID,
//         user: { name, gender, isHost: false }, // << THIS ensures playerOrder is respected
//         }, (res) => {
//         if (res.success) {
//             navigate(`/waiting/${gameID}`, { state: { name, gender, isHost: false } });
//         } else {
//             localStorage.removeItem("kiraly-autoreconnect");
//             navigate("/");
//         }
//     });



//     });
//   }, [navigate]);

//   return null; // This component doesn’t render anything
// };

// export default AutoReconnect;
