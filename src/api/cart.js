import request from '@/utils/request'

// goodsSkuId包含颜色等规格id
export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

export const getCartList = () => {
  return request.get('/cart/list')
}

export const changeCount = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/update', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

// 此处需要的id是item.id
export const delSelect = (cartIds) => {
  return request.post('/cart/clear', {
    cartIds
  })
}

// 购物车商品数量
export const getCartTotal = () => {
  return request.get('/cart/total')
}
