// auth.js
(function () {
  const AUTH = {
    KEY_LOGGED: "admin_logged",
    KEY_NAME: "admin_name",
    // 登录态：用 sessionStorage（关浏览器就退出，更像演示后台）
    get logged() { return sessionStorage.getItem(this.KEY_LOGGED) === "1"; },
    get name() { return sessionStorage.getItem(this.KEY_NAME) || ""; },

    login(name) {
      sessionStorage.setItem(this.KEY_LOGGED, "1");
      sessionStorage.setItem(this.KEY_NAME, name);
    },
    logout() {
      sessionStorage.removeItem(this.KEY_LOGGED);
      sessionStorage.removeItem(this.KEY_NAME);
    },
    requireLogin(redirect = "login.html") {
      if (!this.logged) location.href = redirect;
    }
  };

  window.AUTH = AUTH;
})();
