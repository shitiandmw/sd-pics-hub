<template>
  <div
    class="h-18 w-full border-t border-gray-100 bg-gray-50 shadow flex items-center justify-between px-5"
  >
    <div
      class="group w-16 flex flex-col items-center text-xs text-gray-500"
      :class="index == selectIndex ? 'text-primary' : ''"
      v-for="(item, index) in list"
      :key="'tab' + index"
      @tap="switchTab(index)"
    >
      <div class="w-7 h-7 mb-1">
        <svgTemplates v-if="item.name == 'templates'" />
        <svgImgs v-if="item.name == 'imgs'" />
        <svgMy v-if="item.name == 'my'" />
      </div>
      {{ item.text }}
    </div>
  </div>
</template>

<script>
import svgImgs from "./svg/svg-imgs.vue";
import svgTemplates from "./svg/svg-templates.vue";
import svgMy from "./svg/svg-my.vue";
import { mapState } from "vuex";
export default {
  props: {
    selectIndex: {
      // 定义默认值
      default: 0,
    },
  },
  data() {
    return {
      // selectIndex: uni.getStorageSync("tabbar_index") || 0,
      list: [
        {
          text: "写真模板",
          name: "templates",
          path: "/pages/tab/templates",
          icon: "/static/icon/icon-session.png",
          select_icon: "/static/icon/icon-a-session.png",
        },
        {
          text: "我的照片库",
          name: "imgs",
          path: "/pages/tab/tasks",
          icon: "/static/icon/icon-book.png",
          select_icon: "/static/icon/icon-a-book.png",
        },
        {
          text: "我",
          name: "my",
          path: "/pages/tab/my",
          icon: "/static/icon/icon-my.png",
          select_icon: "/static/icon/icon-a-my.png",
        },
      ],
    };
  },
  mounted() {
    uni.hideTabBar();
  },
  methods: {
    switchTab(index) {
      let item = this.list[index];
      let url = item.path;
      uni.switchTab({ url });
      console.log("switchTab", url);
      // uni.setStorageSync("tabbar_index",index);
      // console.log(uni.getStorageSync("tabbar_index"))
    },
  },
  computed: {},

  components: { svgImgs, svgTemplates, svgMy },
};
</script>

<style>
</style>
