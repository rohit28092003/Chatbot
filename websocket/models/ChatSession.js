import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true, enum: ["user", "bot"] },
  text: { type: String, required: true, trim: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  messages: { type: [messageSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

chatSessionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
export default ChatSession;
