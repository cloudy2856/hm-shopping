<template>
  <div class="order-detail">
    <van-nav-bar fixed
      title="订单详情"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="address" v-if="orderDetail.address">
      <div class="tit">
        <div class="name">{{ orderDetail.address.name }}</div>
        <div class="phone">{{ orderDetail.address.tel }}</div>
        <div class="adress">{{ orderDetail.address.region.province }} {{ orderDetail.address.region.city }} {{ orderDetail.address.region.region }} {{ orderDetail.address.addressDetail }}</div>
      </div>
    </div>
    <div class="item">
      <div class="list-item" v-for="item in orderDetail.goods" :key="item.goods_id">
        <div class="goods-img">
          <img :src="item.goods_image" alt="">
        </div>
        <div class="goods-content">
          <div class="goods-name">{{ item.goods_name }}</div>
        </div>
        <div class="goods-trade">
          <div class="goods-price">¥{{ item.goods_price }}</div>
          <div class="goods-num">x{{ item.total_num }}</div>
        </div>
      </div>
    </div>
    <div class="time" v-if="orderDetail.order_id">
      <div class="tit">
        <div class="order-id">订单编号：{{ orderDetail.order_id }}</div>
        <div class="create-time">下单时间：{{ orderDetail.create_time }}</div>
      </div>
    </div>
    <div class="price" v-if="orderDetail.total_price">
      <div class="tit">
        <div class="total-price">订单金额：￥{{ orderDetail.total_price }}</div>
        <div class="express-price">运费：+￥{{ orderDetail.express_price }}</div>
        <div class="pay-price">实付款：{{ orderDetail.order_price }}</div>
      </div>
    </div>
    <div class="actions">
      <van-button type="danger" @click="handleCancel">取消订单</van-button>
      <van-button type="primary" @click="showPayType = true">去支付</van-button>
    </div>
    <PayMode :visible.sync="showPayType" :orderId="orderDetail.order_id" />
  </div>
</template>

<script>
import { cancelOrder, getOrderDetail } from '@/api/order'
import PayMode from '@/components/PayMode.vue'
export default {
  data () {
    return {
      orderDetail: {},
      showPayType: false
    }
  },
  components: {
    PayMode
  },
  created () {
    this.getOrderDetail()
  },
  methods: {
    getOrderDetail () {
      const orderId = this.$route.query.order_id
      getOrderDetail(orderId).then(res => {
        this.orderDetail = res.data.order
      })
    },
    async handleCancel () {
      this.$dialog.confirm({
        title: '提示',
        message: '确定取消订单吗？'
      }).then(async () => {
        await cancelOrder(this.orderDetail.order_id)
        this.$toast('取消成功')
        this.$emit('refresh')
      }).catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.order-detail {
  padding-top: 46px;
  padding-bottom: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;

  .address {
    background-color: #fff;
    margin: 10px;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .tit {
      .name {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .phone {
        color: #666;
        margin-bottom: 5px;
      }

      .adress {
        color: #999;
        line-height: 1.4;
      }
    }
  }
.item {
  background-color: #fff;
  margin: 10px;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .list-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .goods-img {
      width: 80px;
      height: 80px;
      margin-right: 12px;
      border-radius: 6px;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .goods-content {
      flex: 1;
      margin-right: 12px;

      .goods-name {
        font-size: 14px;
        color: #333;
        line-height: 1.4;
        margin-bottom: 5px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    .goods-trade {
      text-align: right;
      flex-shrink: 0;

      .goods-price {
        font-size: 16px;
        color: #ff4444;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .goods-num {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
  .time {
    background-color: #fff;
    margin: 10px;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .tit {
      .order-id, .create-time {
        color: #666;
        margin-bottom: 8px;
        font-size: 14px;
      }
    }
  }

  .price {
    background-color: #fff;
    margin: 10px;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .tit {
      div {
        margin-bottom: 8px;
        font-size: 14px;

        &.total-price, &.express-price {
          color: #666;
        }

        &.pay-price {
          color: #ff4444;
          font-weight: bold;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
