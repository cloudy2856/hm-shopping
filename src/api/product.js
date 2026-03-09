import request from '@/utils/request'

export const getProList = (obj) => {
  const { sortType, sortPrice, categoryId, goodsName, page } = obj
  return request.get('/goods/list', {
    params: {
      sortType,
      sortPrice,
      categoryId,
      goodsName,
      page
    }
  })
}

export const getProDetail = (goodsId) => {
  return request.get('/goods/detail', {
    params: {
      goodsId
    }
  })
}

export const getProComments = (goodsId, limit) => {
  return request.get('/comment/listRows', {
    params: {
      goodsId,
      limit
    }
  })
}

export const getService = (goodsId) => {
  return request.get('/goods.service/list', {
    params: {
      goodsId
    }
  })
}

export const getCommentTotal = (goodsId) => {
  return request.get('/comment/total', {
    params: {
      goodsId
    }
  })
}

export const getComment = (scoreType, goodsId, page) => {
  return request.get('/comment/list', {
    params: {
      scoreType,
      goodsId,
      page
    }
  })
}
