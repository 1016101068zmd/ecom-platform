const key = `fav_${localStorage.user}`;
const fav = JSON.parse(localStorage.getItem(key) || "[]");

favList.innerHTML = fav.length
  ? fav.map(p => `
    <div class="product" onclick="location.href='product.html?id=${p.id}'">
      <img src="${p.img}">
      <h4>${p.name}</h4>
      <p class="price">￥${p.price}</p>
    </div>
  `).join("")
  : "<p style='padding:20px'>暂无收藏</p>";
