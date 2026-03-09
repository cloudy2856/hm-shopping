<template>
  <div class="user">
    <div class="head-page" v-if="isLogin">
      <div class="head-img" >
        <img :src="detail.avatar ? detail.avatar : require('@/assets/default-avatar.png')" alt="" @click="updateAvatar"/>
      </div>
      <div class="info">
        <div class="mobile">{{ detail.mobile }}</div>
        <div class="vip">
          <van-icon name="diamond-o" />
          普通会员
        </div>
      </div>
    </div>

    <div v-else class="head-page" @click="$router.push('/login')">
      <div class="head-img">
        <img src="@/assets/default-avatar.png" alt="" />
      </div>
      <div class="info">
        <div class="mobile">未登录</div>
        <div class="words">点击登录账号</div>
      </div>
    </div>
    <!-- 头像选择弹出层 -->
    <van-popup v-model="show" position="bottom">
      <van-uploader
        v-model="fileList"
        :max-count="1"
        :max-size="1024 * 1024 * 2"
        :after-read="uploadAvatar"
        accept="image/*"
      />
    </van-popup>

    <div class="my-asset">
      <div class="asset-left">
        <div class="asset-left-item">
          <span>{{ detail.balance || 0 }}</span>
          <span>账户余额</span>
        </div>
        <div class="asset-left-item">
          <span>0</span>
          <span>积分</span>
        </div>
        <div class="asset-left-item">
          <span>0</span>
          <span>优惠券</span>
        </div>
      </div>
      <div class="asset-right">
        <div class="asset-right-item">
          <van-icon name="balance-pay" />
          <span>我的钱包</span>
        </div>
      </div>
    </div>
    <div class="order-navbar">
      <div class="order-navbar-item" @click="$router.push('/myorder?dataType=all')">
        <van-icon name="balance-list-o" />
        <span>全部订单</span>
      </div>
      <div class="order-navbar-item" @click="$router.push('/myorder?dataType=payment')">
        <span v-if="orderStatus.payment > 0" class="num">{{ orderStatus.payment }}</span>
        <van-icon name="clock-o" />
        <span>待支付</span>
      </div>
      <div class="order-navbar-item" @click="$router.push('/myorder?dataType=delivery')">
        <span v-if="orderStatus.delivery > 0" class="num">{{ orderStatus.delivery }}</span>
        <span v-if="orderStatus.delivery > 99" class="num">99+</span>
        <van-icon name="logistics" />
        <span>待发货</span>
      </div>
      <div class="order-navbar-item" @click="$router.push('/myorder?dataType=received')">
        <span v-if="orderStatus.received > 0" class="num">{{ orderStatus.received }}</span>
        <van-icon name="send-gift-o" />
        <span>待收货</span>
      </div>
    </div>

    <div class="service">
      <div class="title">我的服务</div>
      <div class="content">
        <div class="content-item" @click="$router.push('/address')">
          <van-icon name="records" />
          <span>收货地址</span>
        </div>
        <div class="content-item">
          <van-icon name="gift-o" />
          <span>领券中心</span>
        </div>
        <div class="content-item">
          <van-icon name="gift-card-o" />
          <span>优惠券</span>
        </div>
        <div class="content-item">
          <van-icon name="question-o" />
          <span>我的帮助</span>
        </div>
        <div class="content-item">
          <van-icon name="balance-o" />
          <span>我的积分</span>
        </div>
        <div class="content-item">
          <span v-if="orderStatus.refund > 0" class="num">{{ orderStatus.refund }}</span>
          <van-icon name="refund-o" />
          <span>退换/售后</span>
        </div>
      </div>
    </div>

    <div class="logout-btn">
     <button @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script>
import { getOrderStatus } from '@/api/order'
import { getUserInfoDetail } from '@/api/user.js'
export default {
  name: 'UserIndex',
  data () {
    return {
      detail: {},
      orderStatus: {},
      show: false,
      fileList: []
    }
  },
  created () {
    if (this.isLogin) {
      this.getUserInfoDetail()
    }
    this.getOrderStatus()
  },
  computed: {
    isLogin () {
      return this.$store.getters.token
    }
  },
  methods: {
    async getUserInfoDetail () {
      const { data: { userInfo } } = await getUserInfoDetail()
      this.detail = userInfo
    },
    logout () {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '你确认要退出么'
      }).then(() => {
        // 退出是一个动作 => 包含了两步，分别是将 user 和 cart 进行重置
        this.$store.dispatch('user/logout')
      }).catch(() => {})
    },
    async getOrderStatus () {
      const { data: { counts } } = await getOrderStatus()
      this.orderStatus = counts
    },
    updateAvatar () {
      this.$dialog.confirm({
        title: '提示',
        message: '是否上传新头像？'
      }).then(() => {
        this.show = true
      }).catch(() => {})
    },
    async uploadAvatar (file) {
      // 只实现本地预览，不进行实际上传
      const reader = new FileReader()
      reader.onload = (e) => {
        this.detail.avatar = e.target.result
        this.$toast.success('头像预览成功')
        this.show = false
        this.fileList = []
      }
      reader.readAsDataURL(file.file)
    }

  }
}
</script>

<style lang="less" scoped>
.user {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 50px;
}

.head-page {
  height: 130px;
  background: url("http://cba.itlike.com/public/mweb/static/background/user-header2.png");
  background-size: cover;
  display: flex;
  align-items: center;
  .head-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 10px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
.info {
  .mobile {
    margin-bottom: 5px;
    color: #c59a46;
    font-size: 18px;
    font-weight: bold;
  }
  .vip {
    display: inline-block;
    background-color: #3c3c3c;
    padding: 3px 5px;
    border-radius: 5px;
    color: #e0d3b6;
    font-size: 14px;
    .van-icon {
      font-weight: bold;
      color: #ffb632;
    }
  }
}

.my-asset {
  display: flex;
  padding: 20px 0;
  font-size: 14px;
  background-color: #fff;
  .asset-left {
    display: flex;
    justify-content: space-evenly;
    flex: 3;
    .asset-left-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span:first-child {
        margin-bottom: 5px;
        color: #ff0000;
        font-size: 16px;
      }
    }
  }
  .asset-right {
    flex: 1;
    .asset-right-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .van-icon {
        font-size: 24px;
        margin-bottom: 5px;
      }
    }
  }
}

.order-navbar {
  display: flex;
  padding: 15px 0;
  margin: 10px;
  font-size: 14px;
  background-color: #fff;
  border-radius: 5px;
  .order-navbar-item {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 25%;
    .van-icon {
      font-size: 24px;
      margin-bottom: 5px;
    }
    .num {
      z-index: 999;
      position: absolute;
      top: -2px;
      right: 4px;
      min-width: 16px;
      padding: 0 4px;
      color: #fff;
      text-align: center;
      background-color: #ee0a24;
      border-radius: 50%;
    }
  }
}

.service {
  font-size: 14px;
  background-color: #fff;
  border-radius: 5px;
  margin: 10px;
  .title {
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    font-size: 16px;
  }
  .content {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    font-size: 14px;
    background-color: #fff;
    border-radius: 5px;
    .content-item {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 25%;
      margin-bottom: 20px;

      .van-icon {
        font-size: 24px;
        margin-bottom: 5px;
        color: #ff3800;
      }
      .num {
        z-index: 999;
        position: absolute;
        top: -2px;
        right: 4px;
        min-width: 16px;
        padding: 0 4px;
        color: #fff;
        text-align: center;
        background-color: #ee0a24;
        border-radius: 50%;
      }
    }
  }
}

.logout-btn {
  button {
    width: 60%;
    margin: 10px auto;
    display: block;
    font-size: 13px;
    color: #616161;
    border-radius: 9px;
    border: 1px solid #dcdcdc;
    padding: 7px 0;
    text-align: center;
    background-color: #fafafa;
  }
}
</style>
