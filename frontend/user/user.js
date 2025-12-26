let mode = "login";

/* 弹窗控制 */
function openAuth() {
  document.getElementById("authModal").style.display = "block";
  updateModal();
}

function closeAuth() {
  document.getElementById("authModal").style.display = "none";
}

function toggleMode() {
  mode = mode === "login" ? "register" : "login";
  updateModal();
}

function updateModal() {
  const title = document.getElementById("modalTitle");
  const switchText = document.getElementById("switchText");
  const switchLink = document.querySelector(".switch a");

  if (mode === "login") {
    title.innerText = "登录";
    switchText.innerText = "没有账号？";
    switchLink.innerText = "注册";
  } else {
    title.innerText = "注册";
    switchText.innerText = "已有账号？";
    switchLink.innerText = "登录";
  }
}

/* 登录 / 注册 */
function submitAuth() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("请填写完整信息");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users") || "{}");

  if (mode === "register") {
    if (users[username]) {
      alert("注册失败：用户名已存在");
      return;
    }
    if (password.length < 8) {
      alert("注册失败：密码不少于 8 位");
      return;
    }
    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
    alert("注册成功，请登录");
    toggleMode();
    return;
  }

  if (users[username] !== password) {
    alert("用户名或密码错误");
    return;
  }

  localStorage.setItem("loginUser", username);
  closeAuth();
  showUser();
}

/* 登录状态显示 */
function showUser() {
  const user = localStorage.getItem("loginUser");
  document.getElementById("welcomeUser").innerText =
    user ? `你好，${user}` : "";
}

function checkLogin() {
  return localStorage.getItem("loginUser");
}

/* 权限拦截 */
function goCart() {
  if (!checkLogin()) {
    const ok = confirm("该功能需要登录，是否前往登录？");
    if (ok) {
      mode = "login";
      openAuth();
    }
    return;
  }
  alert("进入购物车（示意）");
}

function goProfile() {
  if (!checkLogin()) {
    const ok = confirm("该功能需要登录，是否前往登录？");
    if (ok) {
      mode = "login";
      openAuth();
    }
    return;
  }
  alert("进入个人中心（示意）");
}

window.onload = showUser;
