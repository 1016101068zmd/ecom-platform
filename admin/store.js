// store.js
(function () {
  const Store = {
    PRODUCTS_KEY: "admin_products",
    ORDERS_KEY: "admin_orders",

    load(key, fallback) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try { return JSON.parse(raw); } catch {}
      }
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    },

    save(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    },

    loadProducts() {
      return this.load(this.PRODUCTS_KEY, [
        { id: 1, name: "示例商品 A", category: "数码", price: 99, stock: 20, status: "ON" },
        { id: 2, name: "示例商品 B", category: "家居", price: 129, stock: 12, status: "ON" },
        { id: 3, name: "示例商品 C", category: "零食", price: 59, stock: 50, status: "OFF" },
      ]);
    },

    saveProducts(list) {
      this.save(this.PRODUCTS_KEY, list);
    },

    loadOrders() {
      return this.load(this.ORDERS_KEY, [
        { no: "OD2025001", user: "张三", amount: 199, status: "待支付" },
        { no: "OD2025002", user: "李四", amount: 59, status: "已支付" },
        { no: "OD2025003", user: "王五", amount: 129, status: "已发货" },
      ]);
    },

    saveOrders(list) {
      this.save(this.ORDERS_KEY, list);
    },
  };

  window.Store = Store;
})();
