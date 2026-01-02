function logout() {
  localStorage.removeItem("user");
  location.href = "index.html";
}
function goStatus(status) {
  location.href = `orders.html?status=${status}`;
}

function logout(){
  localStorage.removeItem("user");
  location.href="index.html";
}
const refundOrders = orders.filter(o =>
  o.status === "refunding" || o.status === "refunded"
);
const waitComment = orders.filter(o =>
  o.status === "done" && !o.commented
);
function goComment(order) {
  location.href = `product.html?id=${order.items[0].id}`;
}

