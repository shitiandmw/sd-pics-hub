<template>
  <phone-container class="flex h-full flex-col">
    <head-bar></head-bar>
		<div class="head-util px-4">
			<!-- <div class="w-7 h-7" @tap="back"></div> -->
      <div class="flex-1 text-center">我的照片库</div>
      <div class="w-5 h-5 box-content p-2 pr-0 cursor-pointer" @tap="addTask" ><svgAddTask></svgAddTask></div>
		</div>
    <div class="flex-1 overflow-hidden">
      <scroll-view class="h-full" scroll-y="true">
        <div
          class="border-b-px border-b-gray-100 py-4 bg-white space-y-1 px-4"
          v-for="(item, index) in 5"
          :key="'k' + index"
        >
          <div class="text-xl h-8 text-stone-800">古风写真</div>
          <div
            class="group grid gap-2"
            :class="
              item % 2 == 0
                ? 'grid-cols-2 hw w-50'
                : item % 3 == 0 || item > 4
                ? 'grid-cols-3 hw w-76'
                : 'grid-cols-1 w-42'
            "
          >
            <image
              v-for="(img, img_index) in item"
              :key="'i' + img_index"
              class="w-full group-[.hw]:h-24"
              :mode="item > 1 ? 'aspectFill' : 'widthFix'"
              src="https://file-1305732628.cos.ap-guangzhou.myqcloud.com/r/doppelganger/141151515/compress/f4.png"
              alt=""
            />
          </div>
          <div class="text-sm text-blue-600 flex items-center space-x-1">
            <span>任务排队中，当前第111位</span>
            <div class="w-4 text-blue-500 overflow-hidden">
              <svg-more class="animate-popup3"></svg-more>
            </div>
          </div>
          <div class="flex h-6 items-center justify-between">
            <div class="text-sm text-gray-400">1小时前</div>
            <div class="bg-gray-200 px-2 rounded w-9 h-5">
              <svg-more></svg-more>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <tab-bar :selectIndex="1"></tab-bar>
  </phone-container>
</template>

<script>
import svgUser from "@/components/svg/svg-user.vue";
import svgMore from "@/components/svg/svg-more.vue";
import svgAddTask from "@/components/svg/svg-addtask.vue";
export default {
  data() {
    return {};
  },
  onLoad() {},
  methods: {
    addTask(){
        uni.navigateTo({
        url: "/pages/guide/step",
      });
    }
  },
  components: { svgMore,svgUser ,svgAddTask},
};
</script>

<style>
</style>
