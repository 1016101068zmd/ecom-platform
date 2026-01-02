const oid = new URLSearchParams(location.search).get("id");
const key = `orders_${localStorage.user}`;
const orders = JSON.parse(localStorage.getItem(key)||"[]");
const o = orders.find(x=>x.id==oid);

// 超时 1 小时自动取消
if(Date.now()-o.createTime>3600000){
  o.status="已取消";
  localStorage.setItem(key,JSON.stringify(orders));
  alert("订单超时已取消");
  location.href="orders.html";
}

function pay(type){
  o.status="待发货";
  o.payType=type;
  localStorage.setItem(key,JSON.stringify(orders));

  // 模拟商家发货
  setTimeout(()=>{
    const list = JSON.parse(localStorage.getItem(key));
    const t = list.find(x=>x.id==oid);
    if(t && t.status==="待发货"){
      t.status="待收货";
      localStorage.setItem(key,JSON.stringify(list));
    }
  },5000);

  alert("支付成功");
  location.href="orders.html";
}
