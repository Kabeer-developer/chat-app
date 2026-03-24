const socket = io();

let currentUser = "";

// Join chat
function joinChat() {
  const usernameInput = document.getElementById("username");
  const username = usernameInput.value.trim();

  if (!username) {
    usernameInput.classList.add("shake");
    setTimeout(() => usernameInput.classList.remove("shake"), 500);
    return;
  }

  if (username.length < 2) {
    alert("Username must be at least 2 characters");
    return;
  }

  currentUser = username;

  socket.emit("join", username);

  document.getElementById("login").classList.add("hidden");
  document.getElementById("chat").classList.remove("hidden");

  document.getElementById("messageInput").focus();

  addSystemMessage(`Welcome, ${username}!`);
}

// Send message
function sendMessage() {
  const input = document.getElementById("messageInput");
  const msg = input.value.trim();

  if (!msg) return;

  console.log("Sending:", msg); // debug

  socket.emit("sendMessage", msg);
  input.value = "";
}
// Receive message
socket.on("message", (data) => {
  addMessage({
    user: data.user,
    text: data.text,
    timestamp: new Date() // ✅ FIX: always valid time
  });
});

// Add user message
function addMessage(data) {
  const container = document.getElementById("messages");

  const div = document.createElement("div");
  div.className = "message";

  const time = formatTime(data.timestamp);

  if (data.user === "System") {
    div.classList.add("system");
    div.innerText = data.text;
  } else {
    div.innerText = `${data.user}: ${data.text} (${time})`;
  }

  container.appendChild(div);
  scrollToBottom();
}

// System message
function addSystemMessage(text) {
  const container = document.getElementById("messages");

  const div = document.createElement("div");
  div.className = "system";
  div.innerText = text;

  container.appendChild(div);
  scrollToBottom();
}

// Format time
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
}

// Scroll
function scrollToBottom() {
  const container = document.getElementById("messages");
  container.scrollTop = container.scrollHeight;
}

// Enter key support
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("username").addEventListener("keypress", (e) => {
    if (e.key === "Enter") joinChat();
  });

  document.getElementById("messageInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});

function leaveChat() {
  if (!confirm("Leave chat?")) return;

  socket.disconnect();

  document.getElementById("chat").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");

  document.getElementById("messages").innerHTML = "";
  currentUser = "";
}