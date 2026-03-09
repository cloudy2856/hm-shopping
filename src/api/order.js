import request from '@/utils/request'

// mode: cart    => obj { cartIds }
// mode: buyNow  => obj { goodsId  goodsNum  goodsSkuId }
export const checkOrder = (mode, obj) => {
  return request.get('/checkout/order', {
    params: {
      mode, // cart buyNow
      delivery: 10, // 10 快递配送 20 门店自提
      couponId: 0, // 优惠券ID 传0 不使用优惠券
      isUsePoints: 0, // 积分 传0 不使用积分
      ...obj // 将传递过来的参数对象 动态展开
    }
  })
}

export const submitOrder = (mode, obj) => {
  return request.post('/checkout/submit', {
    mode,
    delivery: 10, // 10 快递配送
    couponId: 0,
    isUsePoints: 0,
    payType: 10, // 余额支付
    ...obj
  })
}

export const getMyOrderList = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType,
      page // List
    }
  })
}

// 订单详情
export const getOrderDetail = (orderId) => {
  return request.get('/order/detail', {
    params: {
      orderId
    }
  })
}

export const cancelOrder = (orderId) => {
  return request.post('/order/cancel', {
    orderId
  })
}

// 订单支付
export const payOrder = (orderId, payType) => {
  return request.post('/order/pay', {
    orderId,
    payType
  })
}

// 商品状态数量
export const getOrderStatus = () => {
  return request.get('/order/todoCounts')
}

// 订单确认收货
export const confirmOrder = (orderId) => {
  return request.post('/order/receipt', {
    orderId
  })
}
