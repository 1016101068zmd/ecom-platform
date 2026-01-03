/**********************
 * 商品基础信息
 **********************/
let currentStar = null; // 记录当前页面点击的星级

const id = new URLSearchParams(location.search).get("id");
const p = products.find(x => x.id == id);

// 页面渲染
img.src = p.img;
name.innerText = p.name;
desc.innerText = p.desc;
price.innerText = p.price;

// 初始化评论
renderComments();

/**********************
 * 加入购物车
 **********************/
function addCart() {
  if (!localStorage.user) return alert("请先登录");

  const key = `cart_${localStorage.user}`;
  const cart = JSON.parse(localStorage.getItem(key) || "[]");

  const item = cart.find(i => i.id == p.id);
  item ? item.count++ : cart.push({ ...p, count: 1 });

  localStorage.setItem(key, JSON.stringify(cart));
  alert("已加入购物车");
}

/**********************
 * 收藏
 **********************/
function addFav() {
  if (!localStorage.user) return alert("请先登录");

  const key = `fav_${localStorage.user}`;
  const fav = JSON.parse(localStorage.getItem(key) || "[]");

  if (fav.find(i => i.id === p.id)) {
    alert("已在收藏夹");
    return;
  }

  fav.push(p);
  localStorage.setItem(key, JSON.stringify(fav));
  alert("已收藏");
}

/**********************
 * 立即购买
 **********************/
function buyNow() {
  if (!localStorage.user) return alert("请先登录");
  location.href = `buy.html?id=${p.id}`;
}


/**********************
 * 商品分享（生成链接 + 自动复制）
 **********************/
function shareToChat() {
  const link = location.origin + "/product.html?id=" + p.id;
  navigator.clipboard.writeText(link);

  const key = `msg_${localStorage.user}`;
  const msgs = JSON.parse(localStorage.getItem(key) || "[]");
  msgs.push({ type: "link", text: link });

  localStorage.setItem(key, JSON.stringify(msgs));
  alert("商品链接已复制并分享到消息");
}

/**********************
 * ⭐ 评分（星级）
 **********************/
function rate(score) {
  if (!localStorage.user) return alert("请先登录再评分");

  currentStar = score; // ⭐ 关键：记住当前点击的星级

  const key = `rate_${p.id}`;
  const list = JSON.parse(localStorage.getItem(key) || "[]");

  if (list.find(i => i.user === localStorage.user)) {
    alert("你已经评过分了");
    return;
  }

  list.push({
    user: localStorage.user,
    score
  });

  localStorage.setItem(key, JSON.stringify(list));
  updateAvgScore();
  alert(`评分成功：${score} 星`);
}


/**********************
 * 发表评论（必须先评分）
 **********************/
function addComment() {
  if (!localStorage.user) return alert("请先登录再评论");

  const text = commentInput.value.trim();
  if (!text) return alert("请输入评论内容");

  // ⭐ 从下拉框读取评分（这是你现在真正的评分来源）
  const starSelect = document.getElementById("star");
  const star = Number(starSelect.value);

  if (!star) {
    alert("请先点击星星进行评分");
    return;
  }

  // 存评分（用于首页排序 / 平均分）
  const rateKey = `rate_${p.id}`;
  const rates = JSON.parse(localStorage.getItem(rateKey) || "[]");

  if (!rates.find(r => r.user === localStorage.user)) {
    rates.push({
      user: localStorage.user,
      score: star
    });
    localStorage.setItem(rateKey, JSON.stringify(rates));
    updateAvgScore();
  }

  // 存评论
  const key = `comment_${id}`;
  const list = JSON.parse(localStorage.getItem(key) || "[]");

  list.push({
    user: localStorage.user,
    text,
    star
  });

  localStorage.setItem(key, JSON.stringify(list));
  commentInput.value = "";
  renderComments();
}


/**********************
 * 渲染评论 + 星级
 **********************/
function renderComments() {
  const list = JSON.parse(localStorage.getItem(`comment_${id}`) || "[]");

  commentList.innerHTML = list.length
    ? list.map(c => `
        <li>
          <b>${c.user}</b>
          <span style="margin-left:6px">⭐ ${c.star}</span>
          <div>${c.text}</div>
        </li>
      `).join("")
    : "<li>暂无评论</li>";
}

/**********************
 * 计算并更新商品平均评分
 **********************/
function updateAvgScore() {
  const list = JSON.parse(localStorage.getItem(`rate_${p.id}`) || "[]");
  if (!list.length) return;

  const avg = (
    list.reduce((s, r) => s + r.score, 0) / list.length
  ).toFixed(1);

  p.avg = avg;
}
function renderScoreInfo() {
  const rates = JSON.parse(localStorage.getItem(`rate_${p.id}`) || "[]");
  const count = rates.length;

  if (!count) {
    scoreInfo.innerText = "暂无评分";
    return;
  }

  const avg = (
    rates.reduce((s, r) => s + r.score, 0) / count
  ).toFixed(1);

  const stars = "⭐".repeat(Math.round(avg));
  scoreInfo.innerText = `${stars} ${avg} 分（${count} 人评价）`;
}
function renderProducts(products) {
  const box = document.getElementById("productList");
  box.innerHTML = products.map(p => `
    <div class="product">
      <h4>${p.name}</h4>
      <p>￥${p.price}</p>
      <button onclick="goDetail(${p.id})">查看</button>
    </div>
  `).join("");
}

function goDetail(id) {
  location.href = `product.html?id=${id}`;
}
