/**********************
 * 登录校验
 **********************/
if (!localStorage.user) {
  alert("请先登录");
  location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {

  const user = localStorage.user;
  const buyKey = `buy_now_${user}`;
  const orderKey = `orders_${user}`;

  let list = [];

  /**********************
   * 优先级 1：单商品立即购买
   **********************/
  const pid = new URLSearchParams(location.search).get("id");
  if (pid) {
    const p = products.find(x => x.id == pid);
    if (p) list = [{ ...p, count: 1 }];
  }

  /**********************
   * 优先级 2：购物车勾选商品
   **********************/
  if (!list.length) {
    const temp = JSON.parse(localStorage.getItem(buyKey) || "[]");
    if (temp.length) list = temp;
  }

  if (!list.length) {
    alert("没有可购买的商品");
    location.href = "cart.html";
    return;
  }

  /**********************
   * 渲染商品
   **********************/
  let totalPrice = 0;
  const buyList = document.getElementById("buyList");
  const total = document.getElementById("total");

  buyList.innerHTML = list.map(i => {
    totalPrice += i.price * i.count;
    return `
      <div class="buy-item">
        <span>${i.name}</span>
        <span>x ${i.count}</span>
        <span>￥${i.price * i.count}</span>
      </div>
    `;
  }).join("");

  total.innerText = totalPrice;

  /**********************
   * 提交订单
   **********************/
  document.getElementById("submitBtn").onclick = function () {

    const receiver = document.getElementById("name").value.trim();
    const phoneNum = document.getElementById("phone").value.trim();
    const address = document.getElementById("addr").value.trim();

    if (!receiver || !phoneNum || !address) {
      alert("请填写完整的收货信息");
      return;
    }

    const orders = JSON.parse(localStorage.getItem(orderKey) || "[]");
    const now = Date.now();

    const order = {
      id: now,
      items: list,
      total: totalPrice,
      receiver,
      phone: phoneNum,
      address,
      status: "待发货",
      createTime: now
    };

    orders.unshift(order);
    localStorage.setItem(orderKey, JSON.stringify(orders));

    localStorage.removeItem(buyKey);

    alert("下单成功");
    location.href = "orders.html";
  };

});

