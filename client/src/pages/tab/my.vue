<template>
	<view class="phone-container p-0">
    <div class="bg-white">
        <head-bar></head-bar>
    </div>
		<div class="flex-1" >
            <div class="py-10 px-8 bg-white flex items-center cursor-pointer" @tap="goDetail">
                <image class="w-18 h-18 rounded-md" :src="user.avatar" alt="">
                <div class="flex-1 ml-6">
                    <div class="text-2xl">{{user.nick_name}}</div>
                    <div class="text-lg h-10 flex items-center text-gray-500">联系号码：{{user.contact_num}}</div>
                </div>
                <image class="w-5 h-5" src="/static/icon/icon-right.png" alt="">
            </div>

            <div class="h-14 flex items-center px-6 space-x-6 mt-2 bg-white">
                <image class="w-6 h-6" src="/static/icon/icon-logout.png" alt="">
                <span class="flex-1">退出登录</span>
            </div>
		</div>
        <tab-bar :selectIndex="2"></tab-bar>
	</view>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      title: "Hello",
    };
  },
  onLoad() {
    console.log("my", this.user);
  },
  methods: {

    goDetail: function () {
      uni.navigateTo({
        url: "/pages/other/my_detail",
      });
    },
  },
  computed:{
    ...mapState("user", ["user"]),
  }
};
</script>

<style>
</style>
