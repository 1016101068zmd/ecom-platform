function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const box = document.getElementById("cartList");
  const total = document.getElementById("totalPrice");

  box.innerHTML = "";
  let sum = 0;

  if (cart.length === 0) {
    box.innerHTML = "<p>购物车为空</p>";
    total.innerText = "总价：￥0";
    return;
  }

  cart.forEach((item, i) => {
    sum += item.price * item.count;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.name}</span>
      <span>￥${item.price}</span>
      <input type="number" min="1" value="${item.count}"
        onchange="updateCount(${i},this.value)">
      <button onclick="removeItem(${i})">删除</button>
    `;
    box.appendChild(div);
  });

  total.innerText = `总价：￥${sum}`;
}

function updateCount(i, val) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart[i].count = Number(val);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeItem(i) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  loadCart();
}

function goBack() {
  location.href = "index.html";
}

window.onload = loadCart;
