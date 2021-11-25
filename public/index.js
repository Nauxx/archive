const button = document.getElementById('send');
const display = document.getElementById('display');
const input = document.getElementById('input');

const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', () => {
  console.log('connected');
});

socket.addEventListener('message', ({ data }) => {
  display.innerHTML = data;
});

button.addEventListener('click', () => {
  let url = input.value;

  socket.send(url);
});
