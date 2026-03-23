const socket = io();

let username = "";

// Join chat
function joinChat() {
  username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter username");

  socket.emit("join", username);

  document.getElementById("login").classList.add("hidden");
  document.getElementById("chat").classList.remove("hidden");
}

// Send message
function sendMessage() {
  const input = document.getElementById("messageInput");
  const msg = input.value.trim();

  if (!msg) return;

  socket.emit("sendMessage", msg);
  input.value = "";
}

// Receive messages
socket.on("message", (data) => {
  const messagesDiv = document.getElementById("messages");

  const div = document.createElement("div");
  div.classList.add("message");

  if (data.user === "System") {
    div.classList.add("system");
    div.innerText = data.text;
  } else {
    div.innerText = `${data.user}: ${data.text}`;
  }

  messagesDiv.appendChild(div);

  // Auto-scroll
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});