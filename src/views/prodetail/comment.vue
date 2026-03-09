<template>
  <div class="comment">
    <van-nav-bar title="商品评价页" left-arrow @click-left="$router.go(-1)" />
    <van-tabs v-model="active" sticky>
      <van-tab name="all">
        <template #title>全部({{ count.all }})</template>
      </van-tab>
      <van-tab name="good">
        <template #title>好评({{ count.praise }})</template>
      </van-tab>
      <van-tab name="medium">
        <template #title>中评({{ count.review }})</template>
      </van-tab>
      <van-tab name="bad">
        <template #title>差评({{ count.negative }})</template>
      </van-tab>
    </van-tabs>

    <div class="comment-list">
      <div class="comment-item" v-for="item in commentList" :key="item.comment_id">
        <div class="top">
          <img :src="item.user ? item.user.avatar_url : defaultImg" alt="">
          <div class="name">{{ item.user ? item.user.nick_name : '匿名用户' }}</div>
          <van-rate :size="16" :value="item.score / 2" color="#ffd21e" void-icon="star" void-color="#eee"/>
          <div class="time">
            {{ item.create_time }}
          </div>
        </div>
        <div class="content">
          {{ item.content }}
          <div v-show="item.is_picture === 1" class="image-container">
            <van-image
              v-for="(img, index) in item.images"
              :key="img.id"
              :src="img.image_url"
              class="comment-image"
              fit="cover"
              @click="previewImages(item.images, index)"
            />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getComment, getCommentTotal } from '@/api/product'
import defaultImg from '@/assets/default-avatar.png'
import { ImagePreview } from 'vant'

export default {
  data () {
    return {
      defaultImg,
      commentList: [],
      active: 'all',
      page: 1,
      count: {}
    }
  },
  created () {
    this.getComment()
    this.getCommentTotal()
  },
  methods: {
    async getComment () {
      const scoreTypeMap = {
        all: -1,
        good: 10,
        medium: 20,
        bad: 30
      }
      const scoreType = scoreTypeMap[this.active]

      const { data: { list } } = await getComment(scoreType, this.$route.query.goodsId, this.page)
      this.commentList = list.data
    },
    async getCommentTotal () {
      const { data: { total } } = await getCommentTotal(this.$route.query.goodsId)
      this.count = total
    },
    previewImages (images, startPosition) {
      const imageUrls = images.map(img => img.image_url)
      ImagePreview({
        images: imageUrls,
        startPosition,
        closeable: true
      })
    }
  },
  watch: {
    active: {
      immediate: true,
      handler () {
        this.getComment()
        this.getCommentTotal()
      }
    }
  }
}
</script>

<style scoped>
 .comment {
    padding: 10px;
  }
  .comment-title {
    display: flex;
    justify-content: space-between;
    .right {
      color: #959595;
    }
  }

  .comment-item {
    font-size: 16px;
    line-height: 30px;
    .top {
      height: 30px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      img {
        width: 20px;
        height: 20px;
      }
      .name {
        margin: 0 10px;
      }
    }
    .time {
      color: #999;
    }
  }

  .image-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }

  .comment-image {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .comment-image:hover {
    transform: scale(1.05);
  }
</style>
