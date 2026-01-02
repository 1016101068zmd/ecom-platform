const key = `cart_${localStorage.user}`;
let cart = JSON.parse(localStorage.getItem(key) || "[]");

/**********************
 * 渲染购物车
 **********************/
function render() {
  cartList.innerHTML = "";
  let sum = 0;

  cart.forEach((i, idx) => {

    // ✅ 只统计勾选商品金额
    if (i.checked) {
      sum += i.price * i.count;
    }

    cartList.innerHTML += `
      <div class="cart-item">
        <!-- 选择框 -->
        <input type="checkbox"
          ${i.checked ? "checked" : ""}
          onchange="toggleCheck(${idx}, this.checked)"
        >

        <span onclick="location.href='product.html?id=${i.id}'">
          ${i.name}
        </span>

        <div>
          <button onclick="change(${idx}, -1)">-</button>
          ${i.count}
          <button onclick="change(${idx}, 1)">+</button>
          <button onclick="del(${idx})">🗑</button>
        </div>
      </div>
    `;
  });

  total.innerText = sum;
  localStorage.setItem(key, JSON.stringify(cart));
}

/**********************
 * 勾选 / 取消勾选
 **********************/
function toggleCheck(index, checked) {
  cart[index].checked = checked;
  localStorage.setItem(key, JSON.stringify(cart));
  render(); // ✅ 重新计算合计
}

/**********************
 * 修改数量
 **********************/
function change(i, n) {
  cart[i].count += n;

  if (cart[i].count <= 0) {
    cart.splice(i, 1);
  }

  render();
}

/**********************
 * 删除商品
 **********************/
function del(i) {
  cart.splice(i, 1);
  render();
}

/**********************
 * 立即购买（仅勾选商品）
 **********************/
function buySelected() {
  if (!localStorage.user) return alert("请先登录");

  const selected = cart.filter(i => i.checked);

  if (!selected.length) {
    alert("请选择要购买的商品");
    return;
  }

  // ✅ 存入临时购买区
  localStorage.setItem(
    `buy_now_${localStorage.user}`,
    JSON.stringify(selected)
  );

  location.href = "buy.html";
}

// 初始渲染
render();
