const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "./img/marboris-dark.svg";
const PERSON_IMG = "./img/mehrab-dark.svg";
const BOT_NAME = "Marboris";
const PERSON_NAME = "Mehrab";

msgerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

  sendMessage(msgText);
});

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  const msgHTML = `
<div class="msg ${side}-msg">
<div class="msg-img" style="background-image: url(${img})"></div>

<div class="msg-bubble">
  <div class="msg-info">
    <div class="msg-info-name">${name}</div>
    <div class="msg-info-time">${formatDate(new Date())}</div>
  </div>

  <div class="msg-text">${text}</div>
</div>
</div>
`;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

// function botResponse() {
//   const r = random(0, BOT_MSGS.length - 1);
//   const msgText = BOT_MSGS[r];
//   const delay = msgText.split(" ").length * 100;

//   setTimeout(() => {
//     appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
//   }, delay);
// }

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}



const botName = "marboris";
const socket = new WebSocket("ws://localhost:8080/websocket");
let userToken = generateToken();
let userLocale = "en";

// WebSocket connection opened
socket.onopen = function (event) {
  console.log("WebSocket is connected");
  handshake();
};

// WebSocket message received
socket.onmessage = function (event) {
  let responseMessage = JSON.parse(event.data);
//   document.getElementById(
//     "response"
//   ).innerText = `${botName}> ${responseMessage.content}`;
  appendMessage(BOT_NAME, BOT_IMG, "left", responseMessage.content);
};

// WebSocket error
socket.onerror = function (error) {
  console.error("WebSocket Error:", error);
};

// WebSocket closed
socket.onclose = function (event) {
  console.log("WebSocket is closed now.");
};

// Function to send handshake message
function handshake() {
  const handshakeMessage = {
    type: 0,
    information: {},
    user_token: userToken,
  };
  socket.send(JSON.stringify(handshakeMessage));
}

// Function to send message
function sendMessage(msg) {
  const content = msg.trim();

  if (content === "/quit") {
    socket.close();
  } else if (content.startsWith("/lang ")) {
    const parts = content.split(" ");
    if (parts.length === 2) {
      userLocale = parts[1];
      console.log(`Language changed to ${userLocale}`);
    } else {
      console.log("Usage: /lang <locale>");
    }
  } else if (content !== "") {
    const message = {
      type: 1,
      content: content,
      user_token: userToken,
      information: {},
      locale: userLocale,
    };
    socket.send(JSON.stringify(message));
  } else {
    console.log("Please enter a message");
  }
}

// Function to generate a random token
function generateToken() {
  let array = new Uint8Array(50);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

// Function to change locale
function changeLocale() {
  const newLocale = prompt("Enter new locale (e.g., en, fr, es):");
  if (newLocale) {
    userLocale = newLocale;
    console.log(`Locale changed to: ${userLocale}`);
  }
}
//# sourceURL=pen.js
