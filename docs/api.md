\# 电商平台后端接口文档



\## 一、用户模块



\### 1. 用户注册

\- URL：/api/register

\- Method：POST

\- Content-Type：application/json



请求参数：

{

&nbsp; "username": "test1",

&nbsp; "password": "123456"

}



成功返回：

{

&nbsp; "message": "注册成功"

}



\### 2. 用户登录

\- URL：/api/login

\- Method：POST



请求参数：

{

&nbsp; "username": "test1",

&nbsp; "password": "123456"

}



成功返回：

{

&nbsp; "message": "登录成功",

&nbsp; "token": "xxxxx"

}



失败返回：

{

&nbsp; "error": "用户名或密码错误"

}



\## 二、商品模块



\### 1. 商品列表

\- URL：/api/products

\- Method：GET



返回示例：

\[

&nbsp; {

&nbsp;   "id": 1,

&nbsp;   "name": "商品A",

&nbsp;   "description": "这是商品A",

&nbsp;   "price": 99.9,

&nbsp;   "stock": 10

&nbsp; }

]



\### 2. 商品详情

\- URL：/api/products/{id}

\- Method：GET



返回示例：

{

&nbsp; "id": 1,

&nbsp; "name": "商品A",

&nbsp; "description": "这是商品A",

&nbsp; "price": 99.9,

&nbsp; "stock": 10

}



\## 三、购物车模块



\### 1. 添加商品到购物车

\- URL：/api/cart

\- Method：POST



请求参数：

{

&nbsp; "user\_id": 1,

&nbsp; "product\_id": 1,

&nbsp; "quantity": 2

}



返回：

{

&nbsp; "message": "添加成功"

}



\### 2. 查询购物车

\- URL：/api/cart/{userId}

\- Method：GET



返回示例：

\[

&nbsp; {

&nbsp;   "id": 1,

&nbsp;   "product\_id": 1,

&nbsp;   "quantity": 2,

&nbsp;   "name": "商品A",

&nbsp;   "price": 99.9

&nbsp; }

]



\### 3. 修改购物车数量

\- URL：/api/cart/{id}

\- Method：PUT



请求参数：

{

&nbsp; "quantity": 5

}



\### 4. 删除购物车商品

\- URL：/api/cart/{id}

\- Method：DELETE



\## 四、订单模块



\### 1. 创建订单

\- URL：/api/orders

\- Method：POST



请求参数：

{

&nbsp; "user\_id": 1

}



返回：

{

&nbsp; "message": "下单成功",

&nbsp; "order\_id": 1

}



\### 2. 查询用户订单

\- URL：/api/orders/{userId}

\- Method：GET



返回示例：

\[

&nbsp; {

&nbsp;   "id": 1,

&nbsp;   "user\_id": 1,

&nbsp;   "total\_price": 199.8,

&nbsp;   "status": "CREATED"

&nbsp; }

]



\### 3. 修改订单状态

\- URL：/api/orders/{id}

\- Method：PUT



请求参数：

{

&nbsp; "status": "PAID"

}



