<template>
  <view class="w-full grid grid-cols-2 gap-6">
      <view class=" rounded-lg overflow-hidden bg-white flex flex-col shadow-lg" v-for="(item,index) in 5" :key="'k'+index">
        <image mode="aspectFill" src="https://file-1305732628.cos.ap-guangzhou.myqcloud.com/r/doppelganger/141151515/compress/f4.png" class="w-full h-52" alt="">
        <view class="text-lg px-2 py-2">啦啦啦</view>
      </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      head_margin_top: "",
    };
  },
  mounted() {
  },
  methods: {
  },
  computed: {
  },
};
</script>
