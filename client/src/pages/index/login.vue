<template>
  <view class="phone-container">
    <head-bar></head-bar>
    <div class="flex-1 mt-2">
      <div class="text-center text-gray-800 text-2xl py-8">用户登录</div>
      <div class="border-b border-gray-200 flex items-center h-14 text-lg">
        <span class="w-28">账号</span>
        <input
          class="flex-1 active:bg-transparent appearance-none outline-none autofill:bg-yellow-200 text-lg"
          type="text"
          v-model="user_name"
          name=""
          placeholder="请输入您的账号"
        />
      </div>
      <div class="border-b border-gray-200 flex items-center h-14 text-lg">
        <span class="w-28">密码</span>
        <input
          class="flex-1 active:bg-transparent appearance-none outline-none autofill:bg-yellow-200 text-lg"
          type="password"
          v-model="user_password"
          name=""
          placeholder="请输入您的密码"
        />
      </div>
    </div>

    <button
      v-if="!loging"
      class="rounded-lg border-0 after:border-0 bg-blue-500 text-white h-14 flex justify-center items-center w-64 my-4 mx-auto"
      @tap="login"
    >
      确认登录
    </button>
    <button
      v-else
      class="rounded-lg border-0 after:border-0 bg-gray-400 text-white h-14 flex justify-center items-center w-64 my-4 mx-auto"
    >
      <div class="loading"></div>
      登录中
    </button>
    <div class="h-10 flex items-center justify-center space-x-4 text-blue-500">
      <span class="cursor-pointer text-gray-500">找回密码</span>
      <span class="cursor-pointer" @tap="goRegister">注册账号</span>
    </div>
  </view>
</template>

<script>
import {  mapActions } from "vuex";
import { md5 } from "@/util/crypto";
export default {
  data() {
    return {
      loging: false,
      user_name: "",
      user_password: "",
    };
  },
  onLoad() {},
  methods: {
    async login() {
      const t = this;
      if (!t.user_name || !t.user_password) {
        uni.showToast({
          title: "请输入账号密码",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (t.loging) return;
      t.loging = true;
      try {
        const timestamp = new Date().valueOf();
        const random_number = Math.floor(Math.random() * 100000000);
        const user_pwd = md5(t.user_password).toLowerCase().substr(5, 23);
        const sign_content = `${timestamp}${user_pwd}username=${t.user_name}&random_number=${random_number}`;
        console.log("sign_content", sign_content);
        const user_key = md5(sign_content).toLowerCase();
        const url = "/account/userkey_login";
        const params = {
          user_name: t.user_name,
          timestamp,
          random_number,
          user_key,
        };

        const system_info = uni.getSystemInfoSync();
        if (system_info) params.logintype = system_info.uniPlatform;

        const res = await this.$http.post(url, params);
        if (res && res.code == 1) {
          const app_login_user = {
            token: res.data.token,
            userid: res.data.userid,
            auth: 1,
            logintype: res.data.logintype,
          };
          uni.setStorageSync("app_login_user", JSON.stringify(app_login_user));

          setTimeout(async () => {
            t.loging = false;
            if (await t.init_user()) t.goIndex();
          }, 300);
        } else
          uni.showToast({
            title: res.message,
            icon: "error",
            duration: 4000,
          });
      } catch (error) {
        console.log("error", error);
      } finally {
        setTimeout(() => {
          t.loging = false;
        }, 500);
      }
    },
    goRegister() {
      uni.redirectTo({
        url: "/pages/index/register",
      });
    },
    goIndex() {
      uni.switchTab({
        url: "/pages/tab/session",
      });
    },
    async init_user() {
      let t = this;
      let user_info = await t.load_user_info();
      if (!user_info) {
        uni.removeStorageSync("app_login_user");
        uni.showToast({
          title:"信息初始化失败，请重试",
          icon: "error",
          duration: 4000,
        });
        return false;
      }
      return true;
    },
    ...mapActions({
      load_user_info: "user/load_user_info", // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
    }),
  },
};
</script>

<style>
</style>
