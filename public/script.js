let username = '';
let lastMessageTimestamp = '';

const sendSound = new Audio('sounds/send.mp3');
const receiveSound = new Audio('sounds/receive.mp3');

function enterChat() {
  username = document.getElementById('username').value;
  if (!username) return alert('Digite seu nome!');
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('chat-screen').style.display = 'block';
  loadMessages();
  setInterval(loadMessages, 2000);
}

function sendMessage() {
  const input = document.getElementById('message');
  const message = input.value.trim();
  if (!message) return;

  fetch('/mensagens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: username, text: message, timestamp: new Date().toISOString() })
  }).then(() => {
    input.value = '';
    sendSound.play();
    loadMessages();
  });
}

function loadMessages() {
  fetch('/mensagens')
    .then(res => res.json())
    .then(data => {
      const box = document.getElementById('chat-box');
      box.innerHTML = '';
      data.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message ' + (msg.sender === username ? 'you' : 'other');
        div.textContent = `${msg.sender}: ${msg.text}`;
        box.appendChild(div);

        if (msg.sender !== username && msg.timestamp !== lastMessageTimestamp) {
          receiveSound.play();
          lastMessageTimestamp = msg.timestamp;
        }
      });
      box.scrollTop = box.scrollHeight;
    });
}
