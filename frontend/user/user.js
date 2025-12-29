let mode = "login";

/* 弹窗控制（老逻辑，不改） */
function openAuth() {
  document.getElementById("authModal").style.display = "flex";
  clearInputs();
  updateModal();
}
function closeAuth() {
  document.getElementById("authModal").style.display = "none";
}
function toggleMode() {
  mode = mode === "login" ? "register" : "login";
  clearInputs();
  updateModal();
}
function updateModal() {
  const title = document.getElementById("modalTitle");
  const text = document.getElementById("switchText");
  const link = document.querySelector(".switch a");
  const tip = document.getElementById("tip");

  tip.innerText = "";

  if (mode === "login") {
    title.innerText = "登录";
    text.innerText = "没有账号？";
    link.innerText = "注册";
  } else {
    title.innerText = "注册";
    text.innerText = "已有账号？";
    link.innerText = "登录";
  }
}


/* 登录 / 注册 */
function submitAuth() {
  const u = username.value.trim();
  const p = password.value;
  const tip = document.getElementById("tip");

  if (!u || !p) {
    tip.innerText = "请填写完整信息";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users") || "{}");

  if (mode === "register") {
    if (users[u]) {
      tip.innerText = "用户名已存在";
      return;
    }
    if (p.length < 8) {
      tip.innerText = "密码不少于 8 位";
      return;
    }
    users[u] = p;
    localStorage.setItem("users", JSON.stringify(users));
    tip.innerText = "注册成功，请登录";
    toggleMode();
    return;
  }

  if (users[u] !== p) {
    tip.innerText = "账号或密码错误";
    return;
  }

  localStorage.setItem("loginUser", u);
  closeAuth();
  updateUserUI();
}

/* 登录态 UI（新增但不影响弹窗） */
function updateUserUI() {
  const user = localStorage.getItem("loginUser");
  const welcome = document.getElementById("welcomeUser");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    welcome.innerText = `你好，${user}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    welcome.innerText = "";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
}

function logout() {
  localStorage.removeItem("loginUser");
  updateUserUI();
}

/* 购物车 */
function addToCart(name, price) {
  if (!localStorage.getItem("loginUser")) {
    alert("请先登录");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const exist = cart.find(i => i.name === name);

  if (exist) {
    exist.count++;
  } else {
    cart.push({ name, price, count: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("已加入购物车");
}

function goCart() {
  if (!localStorage.getItem("loginUser")) {
    alert("请先登录");
    return;
  }
  location.href = "cart.html";
}

function goProfile() {
  if (!localStorage.getItem("loginUser")) {
    alert("请先登录");
    return;
  }
  alert("这里是个人中心（可后续扩展）");
}

function clearInputs() {
  username.value = "";
  password.value = "";
}

window.onload = updateUserUI;
