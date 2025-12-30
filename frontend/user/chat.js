const p = new URLSearchParams(location.search);
const key = `chat_${localStorage.user}_${p.get("type")}_${p.get("name")}`;
let msgs = JSON.parse(localStorage.getItem(key)||"[]");

function render(){
  chatBox.innerHTML = msgs.map(m=>`<div class="bubble">${m}</div>`).join("");
}

function send(){
  if(!msg.value) return;
  msgs.push(msg.value);
  localStorage.setItem(key,JSON.stringify(msgs));
  msg.value="";
  render();
}

render();
