<template>
  <div class="pay-type">
    <van-action-sheet
      title="选择支付方式"
      :value="visible"
      @input="$emit('update:visible', $event)"
      :round="false"
    >
      <div @click="onClickPay('10')">
        <van-icon name="balance-o" />
        余额支付
      </div>
      <div @click="onClickPay('20')">
        <van-icon name="wechat-pay" />
        微信支付
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { payOrder } from '@/api/order'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    onClickPay (type) {
      payOrder(this.orderId, type).then(res => {
        if (res.data.code === 200) {
          this.$toast('支付成功')
          this.$emit('pay', type)
          this.$emit('update:visible', false)
        }
      })
    }
  }
}
</script>

<style scoped>
.pay-type {
  height: 100%;
  background-color: #f5f5f5;
}
.pay-type ::v-deep .van-action-sheet {
  z-index: 2001;
  border-radius: 16px 16px 0 0;
}
.pay-type div {
  padding: 4px;
  border-radius: 8px;
  background-color: #fff;
}
.pay-type ::v-deep .van-icon-balance-o {
  color: #FF9F43;
}

.pay-type ::v-deep .van-icon-wechat-pay {
  color: #07C160;
}
</style>
