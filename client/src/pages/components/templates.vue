<template>
  <view class="w-full grid grid-cols-2 gap-3">
      <view class="overflow-hidden flex flex-col mb-1" v-for="(item,index) in list" :key="index" @tap="selectItem(item)">
        <template v-if="item.imgs && item.imgs.length>0">
          <div class="w-full aspect-square ">
            <image lazy-load="true" mode="aspectFill"  :src="cos_host + item.imgs[0].compress_img" class="w-full h-full rounded-xl " alt="" />
          </div>
          
        </template>
        <template v-else><div class="w-full h-52 bg-gray-100"></div></template>
        <view class="text-base mt-2">{{item.name}}</view>
        <view class="text-xs mt-1 text-gray-400">此女只在画中游</view>
      </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      head_margin_top: "",
      list: [],
      error: "",
      cos_host: process.env.VUE_APP_COS_HOST,
    };
  },
  async mounted() {
    await this.getList();
  },
  methods: {
    selectItem(item) {
      console.log(item._id);
      this.$emit("select", item._id);
    },
    async getList() {
      const url = "/template/list";
      const params = {};
      const res = await this.$http.get(url, params, 2);
      console.log("res", res);
      if (res && res.code == 1) {
        // let list = res.data.list;
        // for(let i=0;i<list.length;i++){

        //   list[i].imgs = list[i].imgs.split(",");
        // }
        this.list = res.data.list;
        console.log("list", this.list);
      } else this.error = res.message;
    },
  },
  computed: {},
};
</script>
