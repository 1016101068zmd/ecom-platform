let isLogin = true;

function openLogin() {
  loginModal.style.display = "flex";
}

function toggleMode() {
  isLogin = !isLogin;
  modalTitle.innerText = isLogin ? "登录" : "注册";
  toggleText.innerText = isLogin ? "没有账号？注册" : "已有账号？登录";
}

function submit() {
  if (!username.value || !password.value) return alert("不能为空");

  let users = JSON.parse(localStorage.users || "{}");

  if (isLogin) {
    if (users[username.value] !== password.value) {
      return alert("账号或密码错误");
    }
  } else {
    if (users[username.value]) return alert("账号已存在");
    users[username.value] = password.value;
    localStorage.users = JSON.stringify(users);
  }

  localStorage.user = username.value;
  loginModal.style.display = "none";
  updateLoginState();
}

function logout() {
  localStorage.removeItem("user");
  updateLoginState();
}

function updateLoginState() {
  const u = localStorage.user;
  hiUser.innerText = u ? `Hi！${u}` : "";
  loginBtn.style.display = u ? "none" : "inline-block";
  logoutBtn.style.display = u ? "inline-block" : "none";
}

updateLoginState();
