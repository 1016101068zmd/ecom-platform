function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

/* 注册 */
function register() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("用户名和密码不能为空");
    return;
  }

  const users = getUsers();
  const exists = users.find(u => u.username === username);

  if (exists) {
    alert("该用户名已存在");
    return;
  }

  users.push({ username, password });
  saveUsers(users);

  alert("注册成功，请登录");
  window.location.href = "login.html";
}

/* 登录 */
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const users = getUsers();
  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    alert("用户名或密码错误");
    return;
  }

  localStorage.setItem("currentUser", username);
  alert("登录成功，欢迎 " + username);
}
