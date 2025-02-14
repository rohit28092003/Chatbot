
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./models/User.js";


const app = express();
const port = process.env.PORT || 5000;




// Load environment variables
dotenv.config();


const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// WebSocket Server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const wss = new WebSocketServer({ server });

let activeUsers = new Map();

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log("Received from client:", message.toString());

    
    ws.send(`${message.toString()}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });

  try {
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});




// const server = app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });

// const wss = new WebSocketServer({ server });

// wss.on("connection", (ws) => {
//   console.log("New client connected");

//   ws.on("message", (message) => {
//     console.log("Received from client:", message.toString());

    
//     ws.send(`${message.toString()}`);
//   });

//   ws.on("close", () => {
//     console.log("Client disconnected");
//   });
// });