# shopping-plateform01 新增功能说明

## 项目来源

本工程基于 `D:\git programmes\ori-account` 工程进行开发完善。
原始项目主要是基于华为账号服务（Account Kit）实现登录、授权、获取头像、手机号、收货地址、发票抬头以及未成年人模式联动等基础功能。

## 新增功能概述

在原始账号示例的基础上，本工程扩展为一个完整的购物平台示例，新增并完善了以下模块：

- 购物页面与商品展示
  - 支持主页浏览商品列表
  - 支持商品分类展示
  - 支持商品详情查看

- 购物车与订单流程
  - 支持加入购物车
  - 支持创建订单
  - 支持支付流程模拟
  - 支持订单列表与订单详情查看

- 用户中心与账号管理
  - 支持登录状态检测与切换
  - 支持用户个人资料展示与编辑
  - 支持退出登录提示

- 二手市集功能
  - 支持转售订单选择与发布
  - 支持我的市集订单管理
  - 支持转售订单编辑与下架

- 购物模式切换
  - 支持常规购物模式与市集模式切换
  - 不同模式下显示不同商品与购物逻辑

- 账号能力与用户信息能力保留
  - 继续保留华为账号静默登录与授权能力
  - 继续支持获取头像、手机号、收货地址、发票抬头
  - 继续支持未成年人模式开启/关闭与密码校验

## 主要新增页面与组件

- `entry/src/main/ets/pages/HomePage.ets`
- `entry/src/main/ets/pages/ShoppingPage.ets`
- `entry/src/main/ets/pages/ShoppingCartPage.ets`
- `entry/src/main/ets/pages/CreateOrderPage.ets`
- `entry/src/main/ets/pages/OrderListPage.ets`
- `entry/src/main/ets/pages/OrderDetailPage.ets`
- `entry/src/main/ets/pages/ResaleSelectPage.ets`
- `entry/src/main/ets/pages/ResaleEditPage.ets`
- `entry/src/main/ets/pages/MyMarketPage.ets`
- `entry/src/main/ets/pages/ProfileEditPage.ets`
- `entry/src/main/ets/pages/MyPage.ets`
- `entry/src/main/ets/pages/ModeSwitchPage.ets`

## 说明

当前工程在保留原 `ori-account` 账号能力示例的基础上，重点扩展为一个购物平台场景：

- 结合账号登录与用户信息获取能力，增强购物体验；
- 结合订单与转售流程，形成从浏览、下单到转售的完整业务链路；
- 结合个人中心与购物模式切换，提升项目的业务完整性与演示价值。

---

> 备注：如果需要，我可以继续补充本工程新增功能对应的具体页面功能说明和使用流程。