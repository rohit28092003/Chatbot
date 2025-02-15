import express from "express";
import ChatSession from "../models/ChatSession.js"; // Ensure the correct file path

const router = express.Router();

// Save a chat session
router.post("/chat", async (req, res) => {
  try {
    const { userId, sessionId, chats } = req.body;

    if (!userId || !sessionId || !Array.isArray(chats)) {
      return res.status(400).json({ error: "Invalid data format. userId, sessionId, and chats are required." });
    }

    const newChatSession = new ChatSession({ userId, sessionId, chats });
    await newChatSession.save();

    res.status(201).json({ message: "Chat session saved successfully", chatSession: newChatSession });
  } catch (error) {
    console.error("Error saving chat session:", error);
    res.status(500).json({ error: "Failed to save chat session" });
  }
});

// Fetch chat history by userId
router.get("/chat/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const chatSessions = await ChatSession.find({ userId });

    if (!chatSessions || chatSessions.length === 0) {
      return res.status(404).json({ message: "No chat history found for this user." });
    }

    res.status(200).json(chatSessions);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

export default router;
