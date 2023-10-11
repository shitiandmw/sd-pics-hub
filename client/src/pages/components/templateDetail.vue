<template>
  <view class="w-full">
    <template v-if="!item">
    <view class="animate-pulse">
      <view class="flex flex-col py-4 space-y-2">
        <view class="text-2xl  bg-gray-200 h-10 w-32"></view>
        <view class="text-base text-gray-500  bg-gray-200 h-6"></view>
     </view>
     <view class="h-56 bg-gray-200">
     </view>
    </view>
    </template>
    <template v-else>
      <view class="flex flex-col py-4 space-y-2">
        <view class="text-2xl">{{item.name}}</view>
        <view class="text-base text-gray-500">{{item.desc}}</view>
     </view>
     <view class="flex flex-col space-y-2">
      <image v-for="(img,index) in item.imgs" :key="'i'+index"  :src="cos_host+img.compress_img" class="w-full" mode="widthFix" alt="">
      </view>
    </template>
     
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["id"],
  data() {
    return {
      head_margin_top: "",
      error: "",
      item: null,
      cos_host:process.env.VUE_APP_COS_HOST
    };
  },
  async mounted() {
    await this.getDetail();
  },
  methods: {
    async getDetail() {
      const url = "/template/info";
      const params = { id : this.id};
      const res = await this.$http.get(url, params, 2);
      console.log("res", res);
      if (res && res.code == 1) {
        this.item = res.data;
      } else this.error = res.message;
    },
  },
  computed: {},
};
</script>
