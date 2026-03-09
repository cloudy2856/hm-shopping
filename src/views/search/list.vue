<template>
  <div class="search">
    <van-nav-bar fixed title="商品列表" left-arrow @click-left="$router.go(-1)" />

    <van-search
      readonly
      shape="round"
      background="#ffffff"
      :value="querySearch || '搜索商品'"
      show-action
      @click="$router.push('/search')"
    >
      <template #action>
        <van-icon class="tool" name="apps-o" />
      </template>
    </van-search>

    <!-- 排序选项按钮 -->
    <div class="sort-btns">
      <div class="sort-item" @click="handleSort('all')">综合</div>
      <div class="sort-item" @click="handleSort('sales')">销量</div>
      <div class="sort-item" @click="handleSort('price')">价格 <span :class="['arrow', sortPrice === 0 ? 'arrow-up' : 'arrow-down']"></span></div>
    </div>

    <div class="goods-list">
      <GoodsItem v-for="item in proList" :key="item.goods_id" :item="item"></GoodsItem>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { getProList } from '@/api/product'
export default {
  name: 'ListIndex',
  components: {
    GoodsItem
  },
  computed: {
    querySearch () {
      return this.$route.query.search
    }
  },
  data () {
    return {
      page: 1,
      proList: [],
      sortType: 'all',
      sortPrice: 0
    }
  },
  async created () {
    this.getProList()
  },
  methods: {
    async getProList () {
      const { data: { list } } = await getProList({
        sortType: this.sortType,
        sortPrice: this.sortPrice,
        categoryId: this.$route.query.categoryId,
        goodsName: this.querySearch,
        page: this.page
      })
      this.proList = list.data
    },
    handleSort (type) {
      this.sortType = type
      if (type === 'price') {
        this.sortPrice = this.sortPrice === 0 ? 1 : 0
      }
      this.getProList()
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .tool {
    font-size: 24px;
    height: 40px;
    line-height: 40px;
  }

  .sort-btns {
    display: flex;
    height: 36px;
    line-height: 36px;
    .sort-item {
      text-align: center;
      flex: 1;
      font-size: 16px;
      position: relative;

      .arrow {
        display: inline-block;
        width: 0;
        height: 0;
        margin-left: 4px;
        opacity: 0.8;
      }

      .arrow-up {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 6px solid #333;
      }

      .arrow-down {
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 6px solid #333;
      }
    }
  }
}

// 商品样式
.goods-list {
  background-color: #f6f6f6;
}
</style>
