const id = new URLSearchParams(location.search).get("id");
const orders = JSON.parse(localStorage.getItem(`orders_${localStorage.user}`) || "[]");
const o = orders.find(x => x.id == id);

detail.innerHTML = `
  <div class="order-card">
    <p>订单号：${o.id}</p>
    <p>状态：${o.status}</p>
    <p>金额：￥${o.total}</p>
  </div>
`;
