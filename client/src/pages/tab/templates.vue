<template>
  <phone-container class="flex h-full flex-col bg-white">
    <head-bar></head-bar>
    <div class="head-util px-4">
      <div class="flex-1 text-center">圆梦照相馆，想你所想</div>
      <div class="w-5 h-5 box-content p-2 pr-0"><svgHelp></svgHelp></div>
    </div>
    <div class="flex-1 overflow-hidden">
      <scroll-view class="h-full px-6" scroll-y="true">
        <div class="mt-4 text-2xl mb-1">写真模板</div>
        <div class="text-base text-gray-500 mb-2">
          选择一个你喜欢的写真模板，出片风格会与此模板相似
        </div>
        <div class="pt-4 pb-8"><templates @select="selectTemplates" ></templates></div>
      </scroll-view>
    </div>
    <lpopup v-model="template.show" class="">
      <div class="flex flex-col h-full">
        <div class="pb-6 pt-2 px-6 overflow-y-auto flex-1">
          <template-detail :id="template.id" v-if="template.show"></template-detail>
        </div>
        <div class="h-20 w-full px-6 py-2 translate-y-1">
          <lbutton class="shadow-xl">使用此模板</lbutton>
        </div>
      </div>
    </lpopup>
    <tab-bar :selectIndex="0"></tab-bar>
  </phone-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import svgHelp from "@/components/svg/svg-help.vue";
import templates from "../components/templates.vue";
import templateDetail from "../components/templateDetail.vue";
import lpopup from "@/components/popup.vue";
import lbutton from "@/components/button.vue";
export default {
  data() {
    return {
      template:{
        show:false,
        id:""
      }
    };
  },
   onLoad() {
  },
  methods: {
    selectTemplates(id){
      this.template.id = id;
      this.template.show = true;
    },
  },
  components: { svgHelp, templates, templateDetail,lpopup,lbutton },
};
</script>

<style>
</style>
