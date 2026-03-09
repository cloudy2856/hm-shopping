import request from '@/utils/request'

export const getAddressList = () => {
  return request.get('/address/list')
}
// 获取默认地址
export const getDefaultAddress = () => {
  return request.get('/address/defaultId')
}

// 设置默认地址
export const setDefaultAddress = (id) => {
  return request.post('/address/setDefault', {
    address_id: id
  })
}
// 获取地址详情
export const getAddressDetail = (id) => {
  return request.get('/address/detail', {
    params: {
      address_id: id
    }
  })
}
// 获取后端省市区地址
export const getAreaAddress = () => {
  return request.get('/region/tree')
}

// 删除地址
export const deleteAddress = (id) => {
  return request.post('/address/remove', {
    address_id: id
  })
}
// 编辑地址
export const editAddress = (id, name, phone, region, detail) => {
  return request.post('/address/edit', {
    address_id: id,
    form: {
      name,
      phone,
      region,
      detail
    }
  })
}
// 添加地址
export const addAddress = (name, phone, region, detail) => {
  return request.post('/address/add', {
    form: {
      name,
      phone,
      region,
      detail
    }
  })
}
