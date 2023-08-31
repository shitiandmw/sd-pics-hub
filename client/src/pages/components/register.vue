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
          class="flex-1 border-0 outline-none placeholder:text-gray-400"
          placeholder="账号（可以是邮箱/手机号）"
          v-model="data.account"
        />
      </div>
      <div
        class="bg-white w-full h-10 rounded border border-gray-200 flex items-center px-2 space-x-2"
      >
        <div class="w-4 h-4 text-gray-500"><svg-edit class=""></svg-edit></div>
        <input
          type="text"
          v-model="data.nick_name"
          class="flex-1 border-0 outline-none placeholder:text-gray-400"
          placeholder="昵称"
        />
      </div>
      <div
        class="bg-white w-full h-10 rounded border border-gray-200 flex items-center px-2 space-x-2"
      >
        <div class="w-4 h-4 text-gray-500"><svg-lock></svg-lock></div>
        <input
        v-model="data.pwd"
          type="password"
          class="flex-1 border-0 outline-none placeholder:text-gray-400"
          placeholder="密码（可以带字母、数字、特殊字符）"
        />
      </div>
      <div
        class="bg-white w-full h-10 rounded border border-gray-200 flex items-center px-2 space-x-2"
      >
        <div class="w-4 h-4 text-gray-500"><svg-lock></svg-lock></div>
        <input
         v-model="data.enter_pwd"
          type="password"
          class="flex-1 border-0 outline-none placeholder:text-gray-400"
          placeholder="确认密码（再输一次密码）"
        />
      </div>
    </div>
    <div class="flex items-center justify-center mb-4">
      <div
        class="bg-blue-500 w-4 h-4 flex items-center justify-center mr-1"
        v-if="data.agree"
        @tap="data.agree = !data.agree"
      >
        <div
          class="w-3 h-2 border-l border-b border-white -rotate-45"
          style="margin-left: 0.05rem; margin-bottom: 0.3rem"
        ></div>
      </div>
      <div
        class="w-4 h-4 border border-gray-500 mr-1"
        v-else
        @tap="data.agree = !data.agree"
      ></div>
      我已阅读<span class="text-blue-500">《用户注册协议》</span>
    </div>
    <lbutton class="shadow-xl h-12 mb-4" v-if="!loading"
      @tap="register">同意并注册</lbutton>

    <lbutton class="shadow-xl h-12 mb-4" v-else >
        <div class="loading"></div>注册中
    </lbutton>
    
    <div class="text-base">
      已经有账号了？<span class="text-primary" @click="goLogin">去登录</span>
    </div>
  </div>
</template>

<script>
import lbutton from "@/components/button.vue";
import svgUser from "@/components/svg/svg-user.vue";
import svgLock from "@/components/svg/svg-lock.vue";
import svgEdit from "@/components/svg/svg-edit.vue";

export default {
  data() {
    return {
      title: "Hello",
      loading: false,
      data: {
        agree: false,
        account: "",
        nick_name: "",
        pwd: "",
        enter_pwd: "",
      },
    };
  },
  onLoad() {},
  methods: {
    async register() {
      if (
        !this.data.account ||
        !this.data.nick_name ||
        !this.data.enter_pwd ||
        !this.data.pwd
      ) {
        uni.showToast({
          title: "请将注册信息填写完整",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (this.data.pwd != this.data.enter_pwd) {
        uni.showToast({
          title: "两次密码输入不一致",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (!this.data.agree) {
        uni.showToast({
          title: "请先勾选 “我已阅读《用户注册协议》”",
          icon: "none",
          duration: 2000,
        });
        return;
      }

      if (this.loading) return;
      this.loading = true;

      try {
        const url = "/account/register";
        const params = {
          account: this.data.account,
          nick_name: this.data.nick_name,
          pwd: this.data.pwd,
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
          uni.showModal({
            title: "系统提示",
            content: "恭喜你注册成功",
            showCancel: false,
            success: () => {
              this.goSuccess();
            },
          });
        } else
          uni.showToast({
            title: res.message,
            icon: "error",
            duration: 2000,
          });
      } catch (error) {
        console.log("error", error);
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    },
    goLogin() {
     this.$emit("goLogin");
    },
    goSuccess(){
     this.$emit("success");
    }
  },
  components: { svgUser, svgLock, lbutton, svgEdit },
};
</script>

<style>
</style>
