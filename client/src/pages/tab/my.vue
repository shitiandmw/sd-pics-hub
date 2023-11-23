<template>
	<view class="phone-container p-0">
    <div class="bg-white">
        <head-bar></head-bar>
    </div>
		<div class="flex-1"  v-if="user" >
            <div class="py-10 px-8 bg-white flex items-center cursor-pointer" @tap="goDetail">
                <image class="w-18 h-18 rounded-md"  :src="user.avatar" alt="">
                <div class="flex-1 ml-6">
                    <div class="text-2xl">{{user.nick_name}}</div>
                    <!-- <div class="text-lg h-10 flex items-center text-gray-500">联系号码：{{user.contact_num}}</div> -->
                </div>
                <!-- <image class="w-5 h-5" src="/static/icon/icon-right.png" alt=""> -->
            </div>

            <div class="h-14 flex items-center px-6 space-x-6 mt-2 bg-white" @tap="onLogout">
                <image class="w-6 h-6" src="/static/icon/icon-logout.png" alt="">
                <span class="flex-1">退出登录</span>
            </div>
		</div>
    <div class="flex-1" v-else></div>
        <tab-bar :selectIndex="2"></tab-bar>
        <lpopup v-model="show_login" class="" :has_close="false">
        <div class="pb-6 pt-10 px-6">
          <login v-if="pupup_index==0" @success="loginSuccess" @goRegister="pupup_index=1"></login>
          <register v-else  @goLogin="pupup_index=0" @success="registerSuccess"></register>
        </div> 
    </lpopup>
	</view>
</template>

<script>
import lpopup from "@/components/popup.vue";
import login from "@/pages/components/login.vue";
import register from "@/pages/components/register.vue";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      pupup_index: 0,
      show_login: false,
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
    onLogout: function () {
      let that = this;
      uni.showModal({
        title: "提示",
        content: "是否确认退出当前账号登录？",
        success: function (res) {
          console.log("res",res)
          if (res.confirm) {
            that.logout();
            uni.navigateTo({
              url: "/pages/login",
            });
          } else if (res.cancel) {
          }
        },
      });
    },
    ...mapActions({
      logout: "user/logout", // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
    }),
  },
  onShow() {
    if (!this.user) {
      uni.navigateTo({
        url: "/pages/login?redirect=/pages/tab/my",
      });
    }
  },
  computed: {
    ...mapState("user", ["user"]),
  },
  components: { lpopup, login, register },
};
</script>

<style>
</style>
