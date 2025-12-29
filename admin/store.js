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
        {
          no: "OD2025001", user: "张三", status: "待支付",
          createdAt: "2025-12-20 12:30",
          address: "上海市浦东新区 XX 路 88 号",
          items: [
            { name: "示例商品 A", price: 99, qty: 1 },
            { name: "示例商品 C", price: 50, qty: 2 },
          ],
        },
        {
          no: "OD2025002", user: "李四", status: "已支付",
          createdAt: "2025-12-21 09:10",
          address: "北京市海淀区 XX 路 12 号",
          items: [
            { name: "示例商品 B", price: 129, qty: 1 },
          ],
        },
        {
          no: "OD2025003", user: "王五", status: "已发货",
          createdAt: "2025-12-22 18:05",
          address: "广州市天河区 XX 路 66 号",
          items: [
            { name: "示例商品 A", price: 99, qty: 1 },
            { name: "示例商品 B", price: 129, qty: 1 },
          ],
        },
      ]).map(o => ({
        ...o,
        amount: (o.items || []).reduce((s, it) => s + it.price * it.qty, 0)
      }));
    },

    saveOrders(list) {
      // 保存前把金额按 items 重新计算，避免手写不一致
      const fixed = list.map(o => ({
        ...o,
        amount: (o.items || []).reduce((s, it) => s + it.price * it.qty, 0),
      }));
      this.save(this.ORDERS_KEY, fixed);
    },
  };

  window.Store = Store;
})();
