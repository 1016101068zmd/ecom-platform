// 后期可接 WebSocket / 接口
function openChat(type,name){
  location.href = `chat.html?type=${type}&name=${name}`;
}
const key = `msg_${localStorage.user}`;
const msgs = JSON.parse(localStorage.getItem(key)||"[]");

userChat.innerHTML = msgs.map(m=>{
  if(m.type==="link"){
    return `<div class="chat-card">
      <a href="${m.text}">${m.text}</a>
    </div>`;
  }
}).join("");
