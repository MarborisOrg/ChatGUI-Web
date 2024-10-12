const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_IMG = "./img/marboris-dark.svg";
const PERSON_IMG = "./img/mehrab-dark.svg";
const BOT_NAME = "Marboris";
const PERSON_NAME = "Mehrab";

msgerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const msgText = msgerInput.value.trim();
  if (!msgText) return;

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";
  sendMessage(msgText);
});

function appendMessage(name, img, side, text) {
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

function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();
  return `${h.slice(-2)}:${m.slice(-2)}`;
}

const socket = new WebSocket("ws://localhost:8080/websocket");
let userToken = generateToken();
let userLocale = "en";

socket.onopen = () => {
  console.log("WebSocket is connected");
  handshake();
};

socket.onmessage = (event) => {
  const responseMessage = JSON.parse(event.data);
  appendMessage(BOT_NAME, BOT_IMG, "left", responseMessage.content);
};

socket.onerror = (error) => {
  console.error("WebSocket Error:", error);
};

socket.onclose = () => {
  console.log("WebSocket is closed now.");
};

function handshake() {
  const handshakeMessage = {
    type: 0,
    information: {},
    user_token: userToken,
  };
  socket.send(JSON.stringify(handshakeMessage));
}

function sendMessage(msg) {
  if (msg === "/quit") {
    socket.close();
  } else if (msg.startsWith("/lang ")) {
    const parts = msg.split(" ");
    if (parts.length === 2) {
      userLocale = parts[1];
      console.log(`Language changed to ${userLocale}`);
    } else {
      console.log("Usage: /lang <locale>");
    }
  } else if (msg !== "") {
    const message = {
      type: 1,
      content: msg,
      user_token: userToken,
      information: {},
      locale: userLocale,
    };
    socket.send(JSON.stringify(message));
  }
}

function generateToken() {
  const array = new Uint8Array(50);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
