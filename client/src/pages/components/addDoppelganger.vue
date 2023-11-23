<template>
  <view class="w-full">
    <div class="text-lg mb-2">模式</div>
    <div class="flex space-x-4 mb-4">
      <div
        class="group overflow-hidden w-36 border border-gray-200 rounded flex h-10 items-center justify-center relative cursor-pointer"
        :class="type == 1 ? 'border-primary text-primary active' : ''"
        @tap="selectType(1)"
      >
        体验模式
        <div
          class="flex items-center justify-center w-4 h-3 absolute -bottom-px -right-px invisible group-[.active]:visible rounded-tl-lg bg-primary text-white"
        >
          <div class="w-2 h-2"><svgSuccess></svgSuccess></div>
        </div>
      </div>
      <div
        class="group overflow-hidden w-36 border border-gray-200 rounded flex h-10 items-center justify-center relative cursor-pointer bg-gray-300"
        :class="type != 1 ? 'border-primary text-primary active' : ''"
        @tap="selectType(2)"
      >
        高级模式
        <div
          class="flex items-center justify-center w-4 h-3 absolute -bottom-px -right-px invisible group-[.active]:visible rounded-tl-lg bg-primary text-white"
        >
          <div class="w-2 h-2"><svgSuccess></svgSuccess></div>
        </div>
      </div>
    </div>
    <div class="text-lg">上传照片</div>
    <div class="text-sm mb-4 text-gray-500">1张五官清晰的正面照片</div>
    <div
      class="mb-2 w-64 h-64 rounded border border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
      @tap="selectImg"
      v-if="!img || img.length <= 0"
    >
      <div class="w-10 h-10 text-gray-400">
        <svgImgsAdd></svgImgsAdd>
      </div>
    </div>
    <div class="mb-2 w-64 h-64 rounded border relative overflow-hidden" v-else>
      <div
        class="w-12 h-12 absolute right-0 top-0 overflow-hidden bg-transparent z-10 cursor-pointer"
        @tap="removeImg"
      ></div>
      <div
        class="w-8 h-8 absolute -right-3 -top-3 bg-gray-900 rounded-full flex items-end justify-start z-0 cursor-pointer"
        @tap="removeImg"
      >
        <div class="w-3 h-3 ml-1 mb-1 text-white">
          <svgClose></svgClose>
        </div>
      </div>
      <image class="w-full h-full" mode="aspectFit" :src="img[0]"></image>
    </div>
    <div class="text-sm mb-2 text-gray-500">样例</div>
    <div class="w-64 flex space-x-2">
      <div class="flex-1 flex items-center flex-col space-y-1">
        <div class="border aspect-square w-full"></div>
        <div class="text-xs">五官清晰</div>
        <div class="w-4 h-4 rounded-full bg-green-700 p-1 text-white">
          <svgSuccess></svgSuccess>
        </div>
      </div>
      <div class="flex-1 flex items-center flex-col space-y-1">
        <div class="border aspect-square w-full"></div>
        <div class="text-xs">不是正面</div>
        <div class="w-4 h-4 rounded-full bg-gray-700 p-1 text-white">
          <svgClose></svgClose>
        </div>
      </div>
      <div class="flex-1 flex items-center flex-col space-y-1">
        <div class="border aspect-square w-full"></div>
        <div class="text-xs">太模糊</div>
        <div class="w-4 h-4 rounded-full bg-gray-700 p-1 text-white">
          <svgClose></svgClose>
        </div>
      </div>
      <div class="flex-1 flex items-center flex-col space-y-1">
        <div class="border aspect-square w-full"></div>
        <div class="text-xs">有遮挡</div>
        <div class="w-4 h-4 rounded-full bg-gray-700 p-1 text-white">
          <svgClose></svgClose>
        </div>
      </div>
    </div>
    <lbutton class="shadow-xl mt-6" @tap="submitData" v-if="!loading"
      >创建</lbutton
    >
    <lbutton class="shadow-xl mt-6" v-else>
      <div class="w-5 h-5 text-white animate-spin mr-1">
        <svgLoading></svgLoading>
      </div>
      <div class="flex items-baseline">
        创建中
        <div class="py-2 text-xs text-gray-300 pl-1">
          <template v-if="loadtext == '正在上传照片'"
            >{{ loadtext }}{{ img_status }}...</template
          >
          <template v-else>{{ loadtext }}...</template>
        </div>
      </div>
    </lbutton>
  </view>
</template>

<script>
import lbutton from "@/components/button.vue";
import svgImgs from "@/components/svg/svg-imgs.vue";
import svgImgsAdd from "@/components/svg/svg-imgs-add.vue";
import svgClose from "@/components/svg/svg-close.vue";
import svgLoading from "@/components/svg/svg-loading1";
import svgSuccess from "@/components/svg/svg-success.vue";
import svgActivetab from "@/components/svg/svg-activetab.vue";
import { mapState } from "vuex";
import TemplateDetail from "./templateDetail.vue";
export default {
  data() {
    return {
      type: 1,
      img: [],
      img_file: [],
      upload_paths: [],
      img_status: "",
      loading: false,
      loadtext: "",
      subres: "",
    };
  },
  async mounted() {},
  methods: {
    chooseImage() {
      return new Promise((resolve, reject) => {
        uni.chooseImage({
          count: 1,
          sizeType: ["original"],
          // sourceType: ["album", "camera"],
          // crop: {
          //   width: 500,
          //   height: 500,
          // },
          success: (res) => {
            resolve(res);
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
    async selectImg() {
      let that = this;
      let choose_res = await that.chooseImage();
      if (choose_res && choose_res.tempFilePaths.length > 0) {
        that.img = choose_res.tempFilePaths;
        that.img_file = choose_res.tempFiles;
        that.upload_paths = [];
      }
    },
    removeImg() {
      this.img = [];
      this.img_file = [];
      this.upload_paths = [];
      this.subres = "";
    },
    selectType(type) {
      if (type == 2)
        uni.showToast({
          title: "高级模式暂未开放",
          icon: "none",
        });
      else this.type = type;
    },
    // 获得cos临时上传凭证
    async getCosUploadInfo(ext = "png") {
      const url = "/doppelganger/getcostoken";
      const params = { ext };
      const res = await this.$http.get(url, params, 2);
      if (res.code != 1) throw new Error(res.message);
      return res.data;
    },
    // 上传文件
    async uploadFile(filepath, ext) {
      let that = this;
      let opt = await that.getCosUploadInfo(ext);
      var formData = {
        key: opt.cosKey,
        policy: opt.policy, // 这个传 policy 的 base64 字符串
        success_action_status: 200,
        "q-sign-algorithm": opt.qSignAlgorithm,
        "q-ak": opt.qAk,
        "q-key-time": opt.qKeyTime,
        "q-signature": opt.qSignature,
      };
      if (opt.securityToken)
        formData["x-cos-security-token"] = opt.securityToken;
      let uploadfile_ = new Promise((resolve, reject) => {
        uni.uploadFile({
          url: "https://" + opt.cosHost, //仅为示例，非真实的接口地址
          filePath: filepath,
          name: "file",
          formData: formData,
          success: (res) => {
            if (![200, 204].includes(res.statusCode)) {
              reject("上传失败,错误:" + res.statusCode);
              return;
            }
            console.log("uploadfile res", res);
            // resolve(
            //   `https://${opt.cosHost}/${that
            //     .camSafeUrlEncode(opt.cosKey)
            //     .replace(/%2F/g, "/")}`
            // );
            console.log("opt.cosKey", opt.cosKey);
            let format_cosKey = that
              .camSafeUrlEncode(opt.cosKey)
              .replace(/%2F/g, "/");
            console.log("format_cosKey", format_cosKey);
            resolve(format_cosKey);
          },
          error(err) {
            reject(err);
          },
        });
      });
      return await uploadfile_;
    },

    camSafeUrlEncode(str) {
      return encodeURIComponent(str)
        .replace(/!/g, "%21")
        .replace(/'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");
    },


    // 上传所有选中图片
    async submitImgs() {
      let that = this;
      if (!that.img || that.img.length <= 0) {
        throw new Error("未选中图片");
      }
      if (that.upload_paths && that.upload_paths.length > 0)
        return that.upload_paths;
      else {
        let upload_paths = [];
        that.img_status = `0/${that.img.length}`;
        for (let i = 0; i < that.img.length; i++) {
          var file = that.img_file[i];
          var fileName = file.name;
          var lastIndex = fileName.lastIndexOf(".");
          var extName = lastIndex > -1 ? fileName.slice(lastIndex + 1) : "";

          let upload_path = await that.uploadFile(that.img[i], extName);
          upload_paths.push(upload_path);
          that.img_status = `${i + 1}/${that.img.length}`;
        }
        that.img_status = ``;
        console.log("upload_paths", upload_paths);
        that.upload_paths = upload_paths;
        return upload_paths;
      }
    },
    // 提交数据
    async submitData() {
      let that = this;
      try {
        // 判断数据
        if (!that.type) throw new Error("请先选择模式");
        if (!that.img || that.img.length <= 0) throw new Error("请先选择照片");
        that.loadtext = `正在提交数据`;
        if (!that.subres) {
          that.loading = true;
          that.loadtext = `正在上传照片`;
          // 1、上传图片
          let upload_imgs = await this.submitImgs();
          that.loadtext = `正在提交数据`;
          // 2、上传数据
          const url = "/doppelganger/create";
          const params = { type: that.type, train_imgs: upload_imgs };
          const res = await this.$http.post(url, params, 2);
          if (res.code != 1) throw new Error(res.message);
          that.subres = res.data;
        }
        await this.$emit("success", that.subres);
        that.loadtext = `创建成功`;
        that.loading = false;
      } catch (error) {
        that.loading = false;
        that.loadtext = ``;
        uni.showToast({
          title: error.message,
          icon: "error",
          duration: 4000,
        });
        this.$emit("fail", error.message);
      }
    },
  },
  computed: {},
  components: {
    svgActivetab,
    svgImgs,
    svgSuccess,
    svgClose,
    svgImgsAdd,
    svgLoading,
    lbutton,
    TemplateDetail,
  },
};
</script>
