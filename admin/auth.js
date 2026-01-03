(function () {
  const AUTH = {
    KEY_LOGGED: "admin_logged",
    KEY_NAME: "admin_name",
    KEY_TOKEN: "admin_token",

    get logged() { return sessionStorage.getItem(this.KEY_LOGGED) === "1"; },
    get name() { return sessionStorage.getItem(this.KEY_NAME) || ""; },
    get token() { return sessionStorage.getItem(this.KEY_TOKEN) || ""; },

    login(name, token) {
      sessionStorage.setItem(this.KEY_LOGGED, "1");
      sessionStorage.setItem(this.KEY_NAME, name);
      sessionStorage.setItem(this.KEY_TOKEN, token || "");
    },

    logout() {
      sessionStorage.removeItem(this.KEY_LOGGED);
      sessionStorage.removeItem(this.KEY_NAME);
      sessionStorage.removeItem(this.KEY_TOKEN);
    },

    requireLogin(redirect = "login.html") {
      if (!this.logged) location.href = redirect;
    }
  };

  window.AUTH = AUTH;
})();
