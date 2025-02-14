import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const port = 5000;

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log("Received from client:", message.toString());

    
    ws.send(`Bot: You said "${message.toString()}"`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
