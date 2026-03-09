<template>
  <div class="address-edit">
    <van-nav-bar
      fixed
      :title="isEdit ? '编辑地址' : '新增地址'"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
    />
  </div>
</template>

<script>
import { addAddress, editAddress, getAddressDetail, getAreaAddress } from '@/api/address'
import { areaList } from '@vant/area-data'

export default {
  name: 'AddressEdit',
  data () {
    return {
      areaList,
      addressInfo: {},
      isEdit: false
    }
  },
  created () {
    // 判断是编辑还是新增
    const addressId = this.$route.query.id
    this.isEdit = !!addressId

    if (this.isEdit) {
      // 如果是编辑模式，需要获取地址详情
      this.getAddressDetail(addressId)
    }
  },
  methods: {
    async getAddressDetail (addressId) {
      const { data: { detail } } = await getAddressDetail(addressId)

      this.addressInfo = {
        id: detail.address_id,
        name: detail.name, // 姓名
        tel: detail.phone, // 电话
        province: detail.region?.province || '', // 省份
        city: detail.region?.city || '', // 城市
        county: detail.region?.region || '', // 区县
        addressDetail: detail.detail, // 详细地址
        areaCode: this.findAreaCode(detail.region?.province, detail.region?.city, detail.region?.region)
      }
    },

    findAreaCode (provinceName, cityName, countyName) {
      if (!provinceName || !cityName || !countyName) return ''

      // 处理名称不匹配问题：自定义后端可能返回"北京"，官方数据可能是"北京市"
      const findMatchingName = (targetName, entries) => {
        // 模糊匹配：包含关系
        const containsMatch = entries.find(([code, name]) =>
          name.includes(targetName) || targetName.includes(name)
        )
        return containsMatch
      }

      // 在官方数据中查找对应的地区编码
      const province = findMatchingName(provinceName, Object.entries(this.areaList.province_list))
      if (!province) return ''

      const city = Object.entries(this.areaList.city_list).find(
        ([code, name]) => name === cityName && code.startsWith(province[0].substring(0, 2))
      )
      if (!city) return ''

      const county = Object.entries(this.areaList.county_list).find(
        ([code, name]) => name === countyName && code.startsWith(city[0].substring(0, 4))
      )

      return county ? county[0] : city[0]
    },

    async onSave (content) {
      const { data: { list } } = await getAreaAddress()

      const findRegionId = () => {
        // 将对象转换为数组以便使用 find 方法
        const listArray = Object.values(list)
        const province = listArray.find(item => {
          if (item.name && (item.name === content.province || item.name.includes(content.province) || content.province.includes(item.name))) {
            return item
          }
          return false
        })
        this.provinceId = province.id

        // 将对象转换为数组以便使用 find 方法
        const cityArray = Object.values(province.city)
        const city = cityArray.find(item => {
          if (item.name && (item.name === content.city || item.name.includes(content.city) || content.city.includes(item.name))) {
            return item
          }
          return false
        })
        this.cityId = city.id

        // 将对象转换为数组以便使用 find 方法
        const regionArray = Object.values(city.region)
        const region = regionArray.find(item => {
          if (item.name && (item.name === content.county || item.name.includes(content.county) || content.county.includes(item.name))) {
            return item
          }
          return false
        })
        this.regionId = region.id
      }
      findRegionId()
      const region = [
        {
          value: this.provinceId,
          label: content.province
        },
        {
          value: this.cityId,
          label: content.city
        },
        {
          value: this.regionId,
          label: content.county
        }
      ]

      if (this.isEdit) {
        await editAddress(this.$route.query.id, content.name, content.tel, region, content.addressDetail)
        this.$toast.success('地址更新成功')
      } else {
        await addAddress(content.name, content.tel, region, content.addressDetail)
        this.$toast.success('地址添加成功')
      }

      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.address-edit {
  padding-top: 46px;
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
