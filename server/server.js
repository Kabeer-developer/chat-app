const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve client files
app.use(express.static("../client"));

let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins
  socket.on("join", (username) => {
    users[socket.id] = username;

    // Notify others
    socket.broadcast.emit("message", {
      user: "System",
      text: `${username} joined the chat`
    });
  });

  // Receive message
  socket.on("sendMessage", (msg) => {
    io.emit("message", {
      user: users[socket.id],
      text: msg
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      socket.broadcast.emit("message", {
        user: "System",
        text: `${username} left the chat`
      });
      delete users[socket.id];
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});