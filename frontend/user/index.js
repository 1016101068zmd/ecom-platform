function getUserKey(key) {
  return `${key}_${localStorage.user}`;
}


function doSearch() {
  const k = searchInput.value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(k)));
}

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

function updateCartCount() {
  if (!localStorage.user) {
    cartCount.innerText = 0;
    return;
  }
  const cart = JSON.parse(localStorage.getItem(getUserKey("cart")) || "[]");
  cartCount.innerText = cart.reduce((s, i) => s + i.count, 0);
}
function renderProducts(arr = products) {

  arr.forEach(p => {
    const rates = JSON.parse(localStorage.getItem(`rate_${p.id}`) || "[]");
    const count = rates.length;

    if (!count) {
      p.avg = 0;
      p.count = 0;
    } else {
      p.avg = (
        rates.reduce((s, r) => s + r.score, 0) / count
      ).toFixed(1);
      p.count = count;
    }
  });

  // ⭐ 按评分从高到低排序
  arr.sort((a, b) => b.avg - a.avg);

  productList.innerHTML = arr.map(p => `
    <div class="product" onclick="location.href='product.html?id=${p.id}'">
      <img src="${p.img}">
      <h4>${p.name}</h4>
      <p style="color:#ff7aa2">
        ${p.avg ? "⭐".repeat(Math.round(p.avg)) + " " + p.avg + " 分" : "暂无评分"}
      </p>
      <p class="price">￥${p.price}</p>
    </div>
  `).join("");
}

renderProducts();
updateCartCount();
