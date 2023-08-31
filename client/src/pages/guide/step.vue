<template>
  <phone-container class="relative">
    <div class="p-6">
      <steps
        :step_index="step_index"
        @switchStep="switchStep"
        class="-mt-2"
      ></steps>
      <!-- 1.选择模板 -->
      <div class="" v-if="step_index==0">
        <div class="mt-8 text-2xl mb-1">写真模板</div>
        <div class="text-base text-gray-500 mb-2">
          选择一个你喜欢的写真模板，出片风格会与此模板相似
        </div>
        <div class="overflow-auto py-4 -mx-6 px-6">
          <templates class=""></templates>
        </div>
      </div>
      <!-- 2.制作数字分身 -->
      <div v-if="step_index==1">
         <div class="mt-8 text-2xl mb-1">制作数字分身</div>
        <div class="text-base text-gray-500 mb-2">
          制作一个你的数字分身，用于代替你在虚拟世界拍摄写真
        </div>
      </div>
    </div>
    <lpopup v-model="template.show" v-if="step_index==0" class="">
      <div class="flex flex-col h-full">
        <div class="pb-6 pt-2 px-6 overflow-y-auto flex-1">
          <template-detail></template-detail>
        </div>
        <div class="h-20 w-full px-6 py-2 translate-y-1">
          <lbutton class="shadow-xl">使用此模板</lbutton>
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


import templates from "../components/templates.vue";
import templateDetail from "../components/templateDetail.vue";

import addDoppelganger from "../components/addDoppelganger.vue";
export default {
  data() {
    return {
      step_index: 1,
      template: {
        _id: "",
        show: true,
      },
    };
  },
  onLoad() {},
  methods: {
    switchStep: function (index) {
      this.step_index = index;
    },
  },
  components: { steps, cbutton, templates, templateDetail, lpopup, lbutton,addDoppelganger },
};
</script>

<style>
</style>
