// import React, { useState, useEffect, useRef } from "react";
// import { IoSend } from "react-icons/io5";

// const Chatbot = () => {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [chatHistory, setChatHistory] = useState([]);
//   const socketRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     socketRef.current = new WebSocket("ws://localhost:5000");

//     socketRef.current.onmessage = (event) => {
//       setMessages((prev) => [...prev, { sender: "bot", text: event.data }]);
//     };

//     return () => {
//       socketRef.current.close();
//     };
//   }, []);

//   const handleSend = (e) => {
//     if (e.key === "Enter" && input.trim()) {
//       const userMessage = input.trim();
//       setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
//       setInput("");

//       if (socketRef.current.readyState === WebSocket.OPEN) {
//         socketRef.current.send(userMessage);
//       }
//     }
//   };

//   const handleNewChat = () => {
//     if (messages.length > 0) {
//       setChatHistory((prev) => [...prev, messages]);
//     }
//     setMessages([]);
//   };

//   const loadChat = (chat) => {
//     setMessages(chat);
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="flex align-middle h-screen w-full border-none">
//       {/* Sidebar */}
//       <div className="w-[20%] border  bg-black h-screen p-4 overflow-y-auto">
//         <h2 className="text-lg font-bold text-white mb-4">History</h2>
//         {chatHistory.map((chat, index) => (
//           <button
//             key={index}
//             className="w-full text-left p-2 mb-2 text-black bg-white rounded-lg hover:bg-black border border-white hover:text-white "
//             onClick={() => loadChat(chat)}
//           >
//             Chat {index + 1}
//           </button>
//         ))}
//       </div>

//       {/* Chat Section */}
//       <div className="w-[80%] flex flex-col items-center justify-center h-screen bg-gray-200 ">
//         <div  
//    className="w-4/6 max-w-md bg-white shadow-lg rounded-lg p-4 flex flex-col h-4/6">
//           <div className="flex justify-between mb-2">
//             <h2 className="text-lg font-bold text-black">Chatbot</h2>
//             <button 
//               className="px-3 py-1 bg-black text-white rounded-lg hover:bg-black" 
//               onClick={handleNewChat}>
//               New Chat
//             </button>
//           </div>
//           <div className="flex-1 overflow-y-auto mb-4 p-2">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}
//               >
//                 <span className={`px-4 py-2 rounded-lg ${msg.sender === "user" ? "bg-black text-white" : "bg-gray-300 text-black"}`}>
//                   {msg.text}
//                 </span>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//           <div className="flex items-center w-full border rounded-lg bg-white border-black">
//   <input
//     type="text"
//     className="flex-1 p-2 text-black bg-gray-100 outline-none"
//     placeholder="Say something..."
//     value={input}
//     onChange={(e) => setInput(e.target.value)}
//     onKeyDown={handleSend}
//   />
//   <button
//     className="p-2 text-black"
//     onClick={() => handleSend({ key: "Enter" })}
//   >
//     <IoSend size={24} />
//   </button>
// </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;




import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Load messages and chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    const savedHistory = localStorage.getItem("chatHistory");
    
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedHistory) setChatHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:5000");

    socketRef.current.onmessage = (event) => {
      const botMessage = { sender: "bot", text: event.data };
      updateMessages(botMessage);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Save chat history when it updates
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const updateMessages = (newMessage) => {
    setMessages((prev) => {
      const updatedMessages = [...prev, newMessage];
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

  const handleSend = (e) => {
    if (e.key === "Enter" && input.trim()) {
      const userMessage = { sender: "user", text: input.trim() };
      updateMessages(userMessage);
      setInput("");

      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(userMessage.text);
      }
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      setChatHistory((prev) => {
        const updatedHistory = [...prev, messages];
        localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    }
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  const loadChat = (chat) => {
    setMessages(chat);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("chatHistory");
    navigate("/login");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex align-middle h-screen w-full border-none">
      {/* Sidebar */}
      <div className="w-[15%] border bg-black h-screen p-4 flex flex-col justify-between">
        <div className="overflow-y-auto">
          <h2 className="text-lg font-bold border-y py-2 text-white mb-4">History</h2>
          {chatHistory.map((chat, index) => (
            <button
              key={index}
              className="w-full text-left p-2 mb-2 text-black bg-white rounded-lg hover:bg-black border border-white hover:text-white"
              onClick={() => loadChat(chat)}
            >
              Chat {index + 1}
            </button>
          ))}
        </div>

        <button 
          className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Chat Section */}
      <div className="w-[85%] flex flex-col items-center justify-center h-screen bg-gray-200">
        <div className="w-4/6 max-w-md bg-white shadow-lg rounded-lg p-4 flex flex-col h-4/6">
          <div className="flex justify-between mb-2">
            <h2 className="text-lg text-black">Ask me! 😊</h2>
            <button 
              className="px-3 py-1 bg-black text-white rounded-lg border border-black hover:bg-white hover:text-black" 
              onClick={handleNewChat}
            >
              New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto mb-4 p-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2`}
              >
                <span className={`px-4 py-2 rounded-lg ${msg.sender === "user" ? "bg-black text-white" : "bg-gray-300 text-black"}`}>
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center w-full border rounded-lg bg-white border-black">
            <input
              type="text"
              className="flex-1 p-2 text-black bg-gray-100 outline-none"
              placeholder="Say something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleSend}
            />
            <button
              className="p-2 text-black"
              onClick={() => handleSend({ key: "Enter" })}
            >
              <IoSend size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
