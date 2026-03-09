<template>
  <div class="address">
    <van-nav-bar fixed title="地址管理" left-arrow @click-left="$router.go(-1)" />

    <!-- 地址列表 -->
    <div class="address-list">
      <van-address-list
        v-model="chosenAddressId"
        :list="Addresslist"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @select="onSelect"
      >
      <template #item-bottom="item">
        <div class="icon-box">
          <!-- 地址默认 -->
          <van-tag type="primary" size="small" v-if="item.id === chosenAddressId">默认</van-tag>
          <!-- 占位元素，确保删除按钮始终在最右边 -->
          <div v-else style="width: 0; height: 0;"></div>
          <!-- 地址删除 -->
          <van-icon name="delete" size="30" color="#ff4444" @click.stop="onDelete(item.id)" />
        </div>
      </template>
      </van-address-list>
    </div>
  </div>
</template>

<script>
import { deleteAddress, getAddressList, getDefaultAddress, setDefaultAddress } from '@/api/address'

export default {
  name: 'AddressIndex',
  data () {
    return {
      chosenAddressId: '',
      Addresslist: []
    }
  },
  async created () {
    await this.getAddressList()
  },
  methods: {
    async getAddressList () {
      const { data: { list } } = await getAddressList()
      this.Addresslist = list.map(item => ({
        id: item.address_id,
        name: item.name,
        tel: item.phone,
        address: `${item.region.province}${item.region.city}${item.region.region}${item.detail}`
      }))
      const { data: { defaultId } } = await getDefaultAddress()
      this.chosenAddressId = defaultId
    },

    onAdd () {
      this.$router.push('/address/edit')
    },

    onEdit (item) {
      this.$router.push(`/address/edit?id=${item.id}`)
    },

    async onSelect (item) {
      // 设置为默认地址
      await setDefaultAddress(item.id)
      this.$toast.success('设置默认地址成功')
      await this.getAddressList()
    },

    // 删除地址
    async onDelete (id) {
      try {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '你确认要删除该地址么'
        }).then(async () => {
          await deleteAddress(id)
          this.$toast.success('地址删除成功')
          await this.getAddressList()
        }).catch(() => {})
      } catch (error) {
        this.$toast.fail('删除失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.address {
  padding-top: 46px;
  padding-bottom: 50px;
}

.icon-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0 16px;
}
</style>
