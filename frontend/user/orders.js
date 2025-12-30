/**********************
 * 登录校验
 **********************/
if (!localStorage.user) {
  alert("请先登录");
  location.href = "login.html";
}

const user = localStorage.user;
const key = `orders_${user}`;
let orders = JSON.parse(localStorage.getItem(key) || "[]");

/**********************
 * 初始渲染
 **********************/
render("全部");

/**********************
 * Tab 切换
 **********************/
function filter(type) {
  render(type);
}

/**********************
 * 渲染订单
 **********************/
function render(type) {
  let list = [];

  if (type === "全部") {
    list = orders;
  } else if (type === "售后") {
    list = orders.filter(o =>
      o.status === "售后中" || o.status === "已退货"
    );
  } else {
    list = orders.filter(o => o.status === type);
  }

  orderList.innerHTML = list.length
    ? list.map(o => `
      <div class="order-card">
        <div>
          ${o.items.map(p => `
            <div>${p.name} × ${p.count}</div>
          `).join("")}
        </div>

        <div class="status">${o.status}</div>
        <div>￥${o.total}</div>

        ${o.status === "待发货" ? `
          <button onclick="view(${o.id})">查看订单</button>
        ` : ""}

        ${o.status === "待收货" ? `
          <button onclick="confirmReceive(${o.id})">确认收货</button>
          <button onclick="refund(${o.id})">售后</button>
        ` : ""}

        ${o.status === "待评价" ? `
          <button onclick="goComment(${o.id})">去评价</button>
        ` : ""}
      </div>
    `).join("")
    : "<p style='padding:20px'>暂无订单</p>";
}

/**********************
 * 查看订单
 **********************/
function view(id) {
  alert("商家正在发货中");
}

/**********************
 * 确认收货
 **********************/
function confirmReceive(id) {
  const o = orders.find(x => x.id === id);
  o.status = "待评价";
  save();
  location.href = `product.html?id=${o.items[0].id}`;
}

/**********************
 * 售后（30秒）
 **********************/
function refund(id) {
  const o = orders.find(x => x.id === id);
  o.status = "售后中";
  save();

  setTimeout(() => {
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    const t = list.find(x => x.id === id);
    if (t) {
      t.status = "已退货";
      localStorage.setItem(key, JSON.stringify(list));
      orders = list;
      render("售后");
    }
  }, 30000);
}

/**********************
 * 自动发货（20秒）
 **********************/
orders.forEach(o => {
  if (o.status === "待发货" && !o._shipping) {
    o._shipping = true;
    save();

    setTimeout(() => {
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      const t = list.find(x => x.id === o.id);
      if (t && t.status === "待发货") {
        t.status = "待收货";
        localStorage.setItem(key, JSON.stringify(list));
        orders = list;
        render("待收货");
      }
    }, 20000);
  }
});

/**********************
 * 保存
 **********************/
function save() {
  localStorage.setItem(key, JSON.stringify(orders));
}
