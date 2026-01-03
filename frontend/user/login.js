const API_BASE = "http://localhost:3000/api";

let isLogin = true;

/**********************
 * 切换登录/注册模式
 **********************/
function toggleMode() {
  isLogin = !isLogin;
  modalTitle.innerText = isLogin ? "登录" : "注册";
  toggleText.innerText = isLogin ? "没有账号？注册" : "已有账号？登录";
}

/**********************
 * 提交表单（登录或注册）
 **********************/
async function submit() {
  const user = username.value.trim();
  const pass = password.value.trim();

  if (!user || !pass) {
    alert("请输入用户名和密码");
    return;
  }

  const endpoint = isLogin ? "/login" : "/register";

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: pass })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "操作失败");
      return;
    }

    if (isLogin) {
      // ✅ 登录成功：存储 token 和用户信息
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", user);
      
      // ✅ 解析 token 获取 userId
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      localStorage.setItem("userId", payload.id);

      alert("登录成功");
      location.reload();
    } else {
      // 注册成功
      alert("注册成功，请登录");
      toggleMode();
    }

    username.value = "";
    password.value = "";

  } catch (err) {
    console.error(err);
    alert("网络错误，请稍后重试");
  }
}

/**********************
 * 打开登录弹窗
 **********************/
function openLogin() {
  loginModal.style.display = "flex";
}

/**********************
 * 关闭登录弹窗（点击外部）
 **********************/
loginModal.onclick = (e) => {
  if (e.target === loginModal) {
    loginModal.style.display = "none";
  }
};

/**********************
 * 退出登录
 **********************/
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  location.reload();
}

/**********************
 * 页面加载时检查登录状态
 **********************/
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (user && token) {
    hiUser.innerText = `你好，${user}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    hiUser.innerText = "";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
});