<template>
  <phone-container class="flex h-full flex-col">
    <head-bar></head-bar>
    <div class="head-util px-4">
      <!-- <div class="w-7 h-7" @tap="back"></div> -->
      <div class="flex-1 text-center">我的照片库</div>
      <div
        class="w-5 h-5 box-content p-2 pr-0 cursor-pointer text-gray-500"
        @tap="addTask"
      >
        <svgAddTask></svgAddTask>
      </div>
    </div>

    <div
      class="flex-1 flex flex-col items-center space-y-4"
      v-if="firstload && (list == null || list.length <= 0)"
    >
      <div class="w-18 h-18 text-gray-300 mt-20"><svgNoData></svgNoData></div>
      <div>还没有创建过任何任务，这里空空如也~</div>
      <lbutton class="w-52 h-12 text-base" @tap="addTask"
        ><div class="w-5 h-5 text-white mr-1"><svgAddTask></svgAddTask></div>
        去创建一个写真</lbutton
      >
    </div>
    <div
      class="flex-1 overflow-hidden"
      v-else-if="list != null && list.length > 0"
    >
      <template>
        <scroll-view
          class="h-full"
          scroll-y="true"
          @scrolltolower="moreList"
          @refresherrefresh="refreshList"
        >
          <div
            class="border-b-px border-b-gray-100 py-4 space-y-1 px-4"
            v-for="(item, index) in list"
            :key="index"
          >
            <div class="text-lg h-8 text-stone-800">
              {{ item.type_name }}
              <template v-if="item.type == 2">
                - {{ item.params.template.name }}
              </template>
            </div>
            <div
              class="group grid gap-2"
              :class="
                item.result.length % 2 == 0
                  ? 'grid-cols-2 hw w-50'
                  : item.result.length % 3 == 0 || item.result.length > 4
                  ? 'grid-cols-3 hw w-76'
                  : 'grid-cols-1 hd w-42'
              "
            >
              <template v-for="(img, img_index) in item.result">
                <whatImg
                  class="w-full group-[.hw]:h-24 group-[.d]:h-56"
                  v-if="img == 'whatimg'"
                  :key="img_index"
                ></whatImg>
                <image lazy-load="true" 
                  v-else
                  :key="img_index"
                  class="w-full group-[.hw]:h-24"
                  :mode="item > 1 ? 'aspectFill' : 'widthFix'"
                  :src="cos_host + img.compress_img"
                  alt=""
                  @tap="previewImage(index, img_index)"
                />
              </template>
            </div>
            <div
              class="text-sm text-green-500 flex items-center space-x-1"
              v-if="item.status == 2"
            >
              <span>任务已完成</span>
            </div>
            <template v-else>
              <div class="text-sm text-blue-600 flex items-center space-x-1">
                <span v-if="item.status == 0"
                  >任务排队中，当前第{{ item.rank }}位</span
                >
                <span v-if="item.status == 1">任务正在执行，请稍等</span>
                <span v-if="item.status == 3">任务正在进入排队</span>
                <div class="w-4 text-blue-500 overflow-hidden">
                  <svg-more class="animate-popup3"></svg-more>
                </div>
              </div>
            </template>

            <div class="flex h-6 items-center justify-between">
              <div class="text-sm text-gray-400">
                {{ item.create_time_format }}
              </div>
              <div class="bg-gray-200 px-2 rounded w-9 h-5">
                <svg-more></svg-more>
              </div>
            </div>
          </div>
        </scroll-view>
      </template>
    </div>
    <div clas="flex-1" v-else></div>
    <tab-bar :selectIndex="1"></tab-bar>
  </phone-container>
</template>

<script>
import lbutton from "@/components/button.vue";
import svgUser from "@/components/svg/svg-user.vue";
import svgMore from "@/components/svg/svg-more.vue";
import svgNoData from "@/components/svg/svg-nodata.vue";
import svgAddTask from "@/components/svg/svg-addtask.vue";
import whatImg from "@/components/what-img.vue";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      firstload: false,
      moreload: false,
      list: [],
      error: "",
      cos_host: process.env.VUE_APP_COS_HOST,
      last_id: "",
    };
  },
  // async onLoad() {
  //   await this.getList();
  // },
  async onShow() {
    if (!this.user) {
      uni.navigateTo({
        url: "/pages/login?redirect=/pages/tab/tasks",
      });
    } else {
      this.firstload = false;
      this.list = [];
      await this.getList();
    }
  },
  methods: {
    async getList() {
      let that = this;
      try {
        const url = "/task/list";
        const params = {};
        if (that.list && that.list.length > 0) {
          params.last_id = that.list[that.list.length - 1]._id;
        }
        const res = await that.$http.get(url, params, 2);
        console.log("res", res);
        if (res && res.code == 1) {
          if (res.data && res.data.length > 0) {
            that.list = that.list.concat(res.data);
          }
          console.log("list", that.list);
        } else this.error = res.message;
      } catch (error) {
        this.error = error.message;
        console.log("error", error);
      } finally {
        that.firstload = true;
      }
    },
    refreshList() {
      console.log("**************refreshList**************");
    },
    async moreList() {
      console.log("**************moreList**************");
      try {
        this.moreload = true;
        await this.getList();
      } catch (error) {
      } finally {
        this.moreload = false;
      }
    },
    addTask() {
      uni.navigateTo({
        url: "/pages/guide/step",
      });
    },

    previewImage(index, img_index) {
      let that = this;
      let urls = [];
      that.list[index].result.forEach((item) => {
        urls.push(this.cos_host + item.origin_img);
      });
      console.log("previewImage", index, img_index);
      uni.previewImage({
        current: img_index,
        urls: urls,
      });
    },
  },
  computed: {
    ...mapState("user", ["user"]),
  },
  components: { svgMore, svgUser, svgAddTask, svgNoData, lbutton, whatImg },
};
</script>

<style>
</style>
