<template>
  <div class="w-full">
    <div class="mb-10">
      <div class="text-3xl text-center font-bold">LOGO</div>
    </div>
    <div class="space-y-6 mb-8">
      <div
        class="bg-white w-full h-10 rounded border border-gray-200 flex items-center px-2 space-x-2"
      >
        <div class="w-4 h-4 text-gray-500"><svg-user class=""></svg-user></div>
        <input
          type="text"
          v-model="user_name"
          class="flex-1 border-0 outline-none placeholder:text-gray-400"
          placeholder="请输入您的账号"
        />
      </div>
      <div
        class="bg-white w-full h-10 rounded border border-gray-200 flex items-center px-2 space-x-2"
      >
        <div class="w-4 h-4 text-gray-500"><svg-lock></svg-lock></div>
        <input
          type="password"
          v-model="user_password"
          class="flex-1 border-0 outline-none placeholder:text-gray-400"
          placeholder="请输入您的密码"
        />
      </div>
    </div>
    <lbutton class="shadow-xl h-12 mb-4" v-if="!loging" @tap="login"
      >确认登录</lbutton
    >
    <lbutton class="shadow-xl h-12 mb-4" v-else
      > <div class="loading"></div>
      登录中</lbutton
    >
    <div class="text-base">
      还没有账号？<span class="text-primary" @click="goRegister">去注册</span>
    </div>
  </div>
</template>

<script>
import lbutton from "@/components/button.vue";
import svgUser from "@/components/svg/svg-user.vue";
import svgLock from "@/components/svg/svg-lock.vue";
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
  mounted() {},
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
    goIndex() {
      this.$emit("success");
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
    goRegister() {
      this.$emit("goRegister");
    },
  },
  computed: {},
  components: { svgUser, svgLock, lbutton },
};
</script>

<style>
</style>
