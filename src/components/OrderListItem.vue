<template>
  <div class="order-list-item" v-if="item.order_id" @click="!showPayType && handleClick">
    <div class="tit">
      <div class="time">{{ item.create_time }}</div>
      <div class="status">
        <span>{{ item.state_text }}</span>
      </div>
    </div>
    <div class="list">
      <div class="list-item" v-for="(goods, index) in item.goods" :key="index">
        <div class="goods-img">
          <img :src="goods.goods_image" alt="">
        </div>
        <div class="goods-content text-ellipsis-2">
          {{ goods.goods_name }}
        </div>
        <div class="goods-trade">
          <p>¥ {{ goods.total_pay_price }}</p>
          <p>x {{ goods.total_num }}</p>
        </div>
      </div>

    </div>
    <div class="total">
      共 {{ item.total_num }} 件商品，总金额 ¥{{ item.total_price }}
    </div>
    <div class="actions">
      <div v-if="item.order_status === 10">
        <span v-if="item.pay_status === 10" @click.stop="showPayType = true">去支付</span>
        <span  @click.stop="handleCancel" v-if="item.delivery_status === 10">申请取消</span>
        <span v-else-if="item.delivery_status === 20 || item.delivery_status === 30" @click.stop="handleConfirm">确认收货</span>
      </div>
      <div v-if="item.order_status === 30">
        <span>评价</span>
      </div>
    </div>
    <PayMode :visible.sync="showPayType" :orderId="item.order_id" />
  </div>
</template>

<script>
import { cancelOrder, confirmOrder } from '@/api/order'
import PayMode from './PayMode.vue'
export default {
  data () {
    return {
      showPayType: false
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    PayMode
  },
  methods: {
    handleClick () {
      this.$router.push({
        path: '/order/detail',
        query: {
          order_id: this.item.order_id
        }
      })
    },
    async handleCancel () {
      this.$dialog.confirm({
        title: '提示',
        message: '确定取消订单吗？'
      }).then(async () => {
        await cancelOrder(this.item.order_id)
        this.$toast('取消成功')
        this.$emit('refresh')
      }).catch(() => {})
    },
    async handleConfirm () {
      this.$dialog.confirm({
        title: '提示',
        message: '确定确认收货吗？'
      }).then(async () => {
        await confirmOrder(this.item.order_id)
        this.$toast('确认成功')
        this.$emit('refresh')
      }).catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.order-list-item {
  margin: 10px auto;
  width: 94%;
  padding: 15px;
  background-color: #ffffff;
  box-shadow: 0 0.5px 2px 0 rgba(0,0,0,.05);
  border-radius: 8px;
  color: #333;
  font-size: 13px;

  .tit {
    height: 24px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .status {
      color: #fa2209;
    }
  }

  .list-item {
    display: flex;
    .goods-img {
      width: 90px;
      height: 90px;
      margin: 0px 10px 10px 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .goods-content {
      flex: 2;
      line-height: 18px;
      max-height: 36px;
      margin-top: 8px;
    }
    .goods-trade {
      flex: 1;
      line-height: 18px;
      text-align: right;
      color: #b39999;
      margin-top: 8px;
    }
  }

  .total {
    text-align: right;
  }
  .actions {
    text-align: right;
    span {
      display: inline-block;
      height: 28px;
      line-height: 28px;
      color: #383838;
      border: 0.5px solid #a8a8a8;
      font-size: 14px;
      padding: 0 15px;
      border-radius: 5px;
      margin: 10px 0;
    }
  }
}
</style>
