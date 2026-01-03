(function () {
  const API = "http://localhost:3000/api";

  const Store = {
    async loadProducts() {
      const res = await fetch(`${API}/products`);
      if (!res.ok) throw new Error("商品加载失败");
      return await res.json();
    },

    async loadOrders() {
      const token = sessionStorage.getItem("admin_token");
      const res = await fetch(`${API}/orders`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("订单加载失败");
      return await res.json();
    },

    async updateOrderStatus(id, status) {
      const token = sessionStorage.getItem("admin_token");
      const res = await fetch(`${API}/orders/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("状态更新失败");
    }
  };

  window.Store = Store;
})();