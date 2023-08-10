<template>
  <view class="phone-container">
    <head-bar></head-bar>
    <div class="flex-1 mt-2">
      <div class="text-center text-gray-800 text-2xl py-8">用户注册</div>
      <div class="border-b border-gray-200 flex items-center h-14 text-lg">
        <span class="w-28">注册账号</span>
        <input
          class="
            flex-1
            active:bg-transparent
            appearance-none
            outline-none
            autofill:bg-yellow-200
            text-lg
          "
          type="text"
          name="name"
          placeholder="可以是邮箱/手机号等"
          id=""
          v-model="data.account"
        />
      </div>
      <div class="border-b border-gray-200 flex items-center h-14 text-lg">
        <span class="w-28">您的昵称</span>
        <input
          class="
            flex-1
            active:bg-transparent
            appearance-none
            outline-none
            autofill:bg-yellow-200
            text-lg
          "
          type="text"
          v-model="data.nick_name"
          placeholder=""
        />
      </div>
      <div class="border-b border-gray-200 flex items-center h-14 text-lg">
        <span class="w-28">账号密码</span>
        <input
          class="
            flex-1
            active:bg-transparent
            appearance-none
            outline-none
            autofill:bg-yellow-200
            text-lg
          "
          type="password"
          v-model="data.pwd"
          autocomplete="new-password"
          placeholder="可以带字母、数字、特殊字符"
        />
      </div>
      <div class="border-b border-gray-200 flex items-center h-14 text-lg">
        <span class="w-28">确认密码</span>
        <input
          class="
            flex-1
            active:bg-transparent
            appearance-none
            outline-none
            autofill:bg-yellow-200
            text-lg
          "
          type="password"
          v-model="data.enter_pwd"
          placeholder="可以带字母、数字、特殊字符"
        />
      </div>
    </div>
    <div class="flex items-center justify-center">
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
    <button
      v-if="!loading"
      @tap="register"
      :class="
        `rounded-lg
        border-0
        after:border-0
        bg-blue-500
        text-white
        h-14
        flex
        justify-center
        items-center
        w-64
        my-4
        mx-auto` + (data.agree ? '' : ' bg-gray-400')
      "
    >
      同意并注册
    </button>
    <button
      v-else
      :class="`rounded-lg
        border-0
        after:border-0
        text-white
        h-14
        flex
        justify-center
        items-center
        w-64
        my-4
        mx-auto  
        bg-gray-400 `"
    >
      <div class="loading"></div>
      提交中
    </button>
    <div class="h-10 flex items-center justify-center text-gray-500">
      已经有账号?<span class="text-blue-500 cursor-pointer" @tap="goLogin"
        >去登陆</span
      >
    </div>
  </view>
</template>

<script>
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
            success: ()=>{
              this.goIndex();
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
      uni.redirectTo({
        url: "/pages/index/login",
      });
    },
    goIndex() {
      uni.switchTab({
        url: "/pages/tab/session",
      });
    },
  },
};
</script>

<style>
</style>
