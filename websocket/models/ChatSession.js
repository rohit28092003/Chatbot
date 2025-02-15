import mongoose from "mongoose";

const ChatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Ensure this matches the User model name
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  chats: [
    {
      sender: { type: String, required: true }, // 'user' or 'server'
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const ChatSession = mongoose.model("ChatSession", ChatSessionSchema);
export default ChatSession;
