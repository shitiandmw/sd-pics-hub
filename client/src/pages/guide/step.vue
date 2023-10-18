<template>
  <phone-container class="h-full overflow-auto">
    <div class="p-6 h-full flex flex-col">
      <steps
        :step_index="step_index"
        @switchStep="switchStep"
        class="-mt-2"
      ></steps>
      <div class="flex-1" :class="step_index == 0 ? 'overflow-hidden' : ''">
        <!-- 1.选择模板 -->
        <scroll-view class="h-full" scroll-y="true" v-show="step_index == 0">
          <div class="">
            <div class="mt-8 text-2xl mb-1">写真模板</div>
            <div class="text-base text-gray-500 mb-2">
              选择一个你喜欢的写真模板，出片风格会与此模板相似
            </div>
            <div class="py-4 -mx-6 px-6">
              <templates class="" @select="selectTemplates"></templates>
            </div>
          </div>
        </scroll-view>

        <!-- 2.制作数字分身 -->
        <div v-show="step_index == 1">
          <div class="mt-8 text-2xl mb-1">制作数字分身</div>
          <div class="text-base text-gray-500 mb-6">
            制作一个你的数字分身，用于代替你在虚拟世界拍摄写真
          </div>
          <addDoppelganger
            @success="createDoppelgangerSuccess"
          ></addDoppelganger>
          <div class="h-10"></div>
        </div>

        <!-- 3.完成 -->
        <div v-show="step_index == 2">
          <!-- <div class="mt-32 mb-10 flex items-center justify-center">
            <div class="w-24 h-24 text-green-500">
              <svgSuccess></svgSuccess>
            </div>
          </div> -->
          <div class="text-lg mt-10">
            <div class="flex items-start">
              <!-- <div class="w-12 h-12 text-gray-900 mr-2 -mt-2">
                <svgSuccess></svgSuccess>
              </div> -->
              <div class="space-y-2">
                <div class="text-2xl flex items-center text-gray-900">
                  任务创建成功
                </div>
                <div class="text-base text-gray-600">
                  写真任务已经成功提交到系统，AI处理任务需要一点时间，请等待...
                </div>
              </div>
            </div>
          </div>
          <div class="flex mt-14 space-x-4">
            <lbutton class="flex-1 h-10 rounded-full text-base"  @tap="goTasks"
              >查看任务状态</lbutton
            >
            <lbutton
              class="border h-10 w-24 rounded-full text-base bg-gray-50 text-gray-600"  @tap="goHome"
              >去首页</lbutton
            >
          </div>
        </div>
      </div>
    </div>
    <lpopup v-model="template.show" v-if="step_index == 0" class="">
      <div class="flex flex-col h-full">
        <div class="pb-6 pt-2 px-6 overflow-y-auto flex-1">
          <template-detail
            :id="template._id"
            v-if="template.show"
          ></template-detail>
        </div>
        <div class="h-20 w-full px-6 py-2 translate-y-1">
          <lbutton class="shadow-xl" @tap="enterSelect">使用此模板</lbutton>
        </div>
      </div>
    </lpopup>
  </phone-container>
</template>

<script>
import lbutton from "@/components/button.vue";
import steps from "./components/steps.vue";
import cbutton from "@/components/button.vue";
import lpopup from "@/components/popup.vue";
import svgSuccess from "@/components/svg/svg-success.vue";

import templates from "../components/templates.vue";
import templateDetail from "../components/templateDetail.vue";

import addDoppelganger from "../components/addDoppelganger.vue";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      step_index: 0,
      template: {
        _id: "",
        show: false,
      },

      subdata: {
        select_template_id: "",
        select_doopelganger_id: "",
      },

      sub_result: {
        success: false,
        error: "",
        data: "",
      },
    };
  },
  onLoad() {},
  onShow(){
    if (!this.user) {
      uni.navigateTo({
        url: "/pages/login?redirect=/pages/guide/step",
      });
    }
  },
  methods: {
    switchStep: function (index) {
      this.step_index = index;
    },
    selectTemplates(id) {
      this.template._id = id;
      this.template.show = true;
    },
    enterSelect() {
      this.subdata.select_template_id = this.template._id;
      this.template.show = false;
      this.step_index = 1;
    },
    // 创建数字分身成功
    async createDoppelgangerSuccess(doopelganger_id) {
      let that = this;
      try {
        // 判断数据
        if (!doopelganger_id) throw new Error("请先提交数字分身");
        if (!that.subdata.select_template_id)
          throw new Error("请先选择写真模板");
        that.subdata.select_doopelganger_id = doopelganger_id;
        // 创建任务
        let url = "/task/generate_portrait";
        let params = {
          template_id: that.subdata.select_template_id,
          doopelganger_id: that.subdata.select_doopelganger_id,
        };
        const res = await this.$http.post(url, params, 2);
        if (res.code != 1) throw new Error(res.message);
        that.sub_result.success = true;
        that.sub_result.sub_result = res.data;

        this.step_index = 2;
      } catch (error) {
        uni.showToast({
          title: error.message,
          icon: "error",
          duration: 4000,
        });
      }
    },

    // 去首页
    goHome() {
      uni.switchTab({
        url: "/pages/tab/templates",
      });
    },
    // 任务列表
    goTasks() {
      uni.switchTab({
        url: "/pages/tab/tasks",
      });
    },
  },
  computed: {
    ...mapState("user", ["user"]),
  },
  components: {
    steps,
    cbutton,
    templates,
    templateDetail,
    lpopup,
    lbutton,
    addDoppelganger,
    svgSuccess,
  },
};
</script>

<style>
</style>
