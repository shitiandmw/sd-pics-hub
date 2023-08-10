<template>
		<div class="h-18 w-full border-t border-gray-100 bg-gray-50 flex items-center justify-between px-5">
			<div class="w-12 flex flex-col items-center text-xs" v-for="(item,index) in list" :key="'tab'+index" @tap="switchTab(index)" >
				<div class="w-7 h-7  mb-1">
                    <image :src="item.select_icon" class="w-7 h-7" alt="" v-if="selectIndex == index">
                    <image :src="item.icon" class="w-7 h-7" alt="" v-else>
                </div>
				{{item.text}}
			</div>
			<!-- <div class="w-12 flex flex-col items-center text-xs">
				<div class="w-7 h-7  mb-1"><image src="/static/icon/icon-book.png" class="w-7 h-7" alt=""></div>
				通讯录
			</div>
			<div class="w-12 flex flex-col items-center text-xs   text-blue-500">
				<div class="w-7 h-7  mb-1"><image src="/static/icon/icon-a-my.png" class="w-7 h-7" alt=""></div>
				我
			</div> -->
		</div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    selectIndex: {
		// 定义默认值
		default: 0
	},
  },
  data() {
    return {
      // selectIndex: uni.getStorageSync("tabbar_index") || 0,
      list: [
        {
          text: "聊天",
          icon: "/static/icon/icon-session.png",
          select_icon: "/static/icon/icon-a-session.png",
          path: "/pages/tab/session",
        },
        {
          text: "通讯录",
          icon: "/static/icon/icon-book.png",
          select_icon: "/static/icon/icon-a-book.png",
          path: "/pages/tab/a_book",
        },
        {
          text: "我",
          icon: "/static/icon/icon-my.png",
          select_icon: "/static/icon/icon-a-my.png",
          path: "/pages/tab/my",
        },
      ],
    };
  },
  mounted(){
    uni.hideTabBar();
  },
  methods: {
    switchTab(index) {
      let item = this.list[index];
      let url = item.path;
      uni.switchTab({ url });
      // console.log("switchTab",url);
      // uni.setStorageSync("tabbar_index",index);
      // console.log(uni.getStorageSync("tabbar_index"))
    },
  },
  computed: {},
};
</script>

<style>
</style>
