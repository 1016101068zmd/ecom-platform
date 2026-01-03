/**********************
 * 工具函数
 **********************/
function getUserKey(key) {
  return `${key}_${localStorage.user}`;
}

/**********************
 * 页面跳转
 **********************/
function goCart() {
  if (!localStorage.user) return alert("请先登录");
  location.href = "cart.html";
}
function goProfile() {
  if (!localStorage.user) return alert("请先登录");
  location.href = "profile.html";
}
function goMessage() {
  if (!localStorage.user) return alert("请先登录");
  location.href = "message.html";
}
function goDetail(id) {
  location.href = `product.html?id=${id}`;
}

/**********************
 * 购物车数量
 **********************/
function updateCartCount() {
  if (!localStorage.user) {
    cartCount.innerText = 0;
    return;
  }
  const cart = JSON.parse(localStorage.getItem(getUserKey("cart")) || "[]");
  cartCount.innerText = cart.reduce((s, i) => s + i.count, 0);
}

/**********************
 * 商品渲染（只保留一个）
 **********************/
function renderProducts(list) {
  const box = document.getElementById("productList");

  list.forEach(p => {
    const rates = JSON.parse(localStorage.getItem(`rate_${p.id}`) || "[]");
    const count = rates.length;
    p.avg = count
      ? (rates.reduce((s, r) => s + r.score, 0) / count).toFixed(1)
      : 0;
    p.count = count;
  });

  // 按评分排序
  list.sort((a, b) => b.avg - a.avg);

  box.innerHTML = list.map(p => `
    <div class="product" onclick="goDetail(${p.id})">
      <h4>${p.name}</h4>
      <p style="color:#ff7aa2">
        ${p.avg ? "⭐".repeat(Math.round(p.avg)) + " " + p.avg + " 分" : "暂无评分"}
      </p>
      <p class="price">￥${p.price}</p>
    </div>
  `).join("");
}

/**********************
 * 页面加载 → 从数据库取商品
 **********************/
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  fetch("/api/products")

    .then(res => res.json())
    .then(list => {
      renderProducts(list);
    })
    .catch(err => {
      console.error(err);
      alert("商品加载失败");
    });
});
