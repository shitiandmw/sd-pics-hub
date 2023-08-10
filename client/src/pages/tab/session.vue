<template>
  <view class="phone-container p-0">
    <head-bar></head-bar>
    <div class="head-util">微书，书写美好生活</div>
    <scroll-view class="flex-1" scroll-y="true">
      <div
        class="session py-3 px-3 flex items-center bg-white active:bg-gray-50 border-b border-gray-100"
        @tap="goChat"
      >
        <image
          class="bg-gray-200 w-12 h-12 rounded-md"
          src="/static/user2.png"
        ></image>
        <div class="flex-1 ml-3">
          <div class="flex items-center mb-0.5">
            <div class="text-lg text-gray-700 flex-1">系统</div>
            <div class="inline-block text-gray-400 text-sm">现在</div>
          </div>
          <div class="text-sm text-gray-400">点进来跟ChatGPT聊一下</div>
        </div>
      </div>
      <!-- <div
        class="session py-3 px-3 flex items-center bg-white active:bg-gray-50 border-b border-gray-100"
        @tap="goChat"
      >
        <image
          class="bg-gray-200 w-12 h-12 rounded-md"
          src="/static/user1.png"
        ></image>
        <div class="flex-1 ml-3">
          <div class="flex items-center mb-0.5">
            <div class="text-lg text-gray-700 flex-1">疯狂生活小镇</div>
            <div class="inline-block text-gray-400 text-sm">星期三</div>
          </div>
          <div class="text-sm text-gray-400">周三外卖券！电影票5折</div>
        </div>
      </div> -->
    </scroll-view>
    <tab-bar :selectIndex="0"></tab-bar>
  </view>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      title: "Hello",
    };
  },
  onLoad() {
    if (this.state != 1) this.$socket.open();
    uni.hideTabBar();
    this.tGet();
    this.tPost();
  },
  methods: {
    tGet: async function () {
      const url = "/default/test";
      const params = { user: 1 };
      const res = await this.$http.get(url, params, 2);
      console.log("res", res);
    },
    tPost: async function () {
      const url = "/default/test";
      const params = { user: 1 };
      const res = await this.$http.post(url, params, 2);
      console.log("res", res);
    },
    goChat: function () {
      uni.navigateTo({
        url: "/pages/other/session_detail",
      });
    },
  },
  computed: {
    ...mapState("socket", ["state"]),
  },
};
</script>

<style>
</style>
