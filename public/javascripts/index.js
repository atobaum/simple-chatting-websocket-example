const log = document.getElementById("log");
const form = document.getElementById("form");
let ws = new WebSocket("ws://localhost:3000", ["chatting", "echo"]);
ws.onopen = function (evt) {
  console.log("Open: ", evt);
};

ws.onmessage = function (evt) {
  console.log("Message: ", evt);
  const div = document.createElement("div");
  div.innerText = evt.data;
  log.appendChild(div);
};
ws.onerror = function (evt) {
  console.log("Error: ", evt);
};

ws.onclose = function (evt) {
  console.log("Close: ", evt);
};

form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  ws.send(evt.target.content.value);
});
