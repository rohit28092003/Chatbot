// import { useState, useEffect } from "react";
// import socket from "../services/socket.js"; // Ensure the correct path

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   useEffect(() => {
//     // Listen for incoming messages
//     socket.on("message", (msg) => {
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });

//     return () => {
//       socket.off("message"); // Cleanup listener on unmount
//     };
//   }, []);

//   const sendMessage = () => {
//     if (input.trim() !== "") {
//       socket.emit("message", input); // Send message to server
//       setInput(""); // Clear input field
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
//       <h1 className="text-2xl font-bold mb-4">Real-Time Chat</h1>
//       <div className="border p-4 rounded bg-gray-800 w-96">
//         {messages.map((msg, index) => (
//           <p key={index} className="bg-gray-700 p-2 rounded mb-2">{msg}</p>
//         ))}
//       </div>
//       <div className="flex mt-4">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="p-2 rounded bg-gray-700 text-white"
//           placeholder="Type a message..."
//         />
//         <button onClick={sendMessage} className="ml-2 bg-blue-500 p-2 rounded">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
