<template>
  <view class="w-full grid grid-cols-2 gap-6">
      <view class=" rounded-lg overflow-hidden bg-white flex flex-col shadow-lg" v-for="(item,index) in list" :key="'k'+index" @tap="selectItem(item)">
        <template v-if="item.imgs && item.imgs.length>0"><image mode="aspectFill"  :src="cos_host + item.imgs[0].compress_img" class="w-full h-52" alt=""></template>
        <template v-else><div class="w-full h-52 bg-gray-100"></div></template>
        <view class="text-lg px-2 py-2">{{item.name}}</view>
      </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      head_margin_top: "",
      list:[],
      error:"",
      cos_host:process.env.VUE_APP_COS_HOST
    };
  },
  async mounted() {
    await this.getList();
  },
  methods: {
    selectItem(item){
      console.log(item._id)
      this.$emit("select",item._id);
    },
    async getList() {
      const url = "/template/list";
      const params = {};
      const res = await this.$http.get(url, params,2);
      console.log("res",res)
      if (res && res.code == 1) {
        // let list = res.data.list;
        // for(let i=0;i<list.length;i++){
          
        //   list[i].imgs = list[i].imgs.split(",");
        // }
        this.list = res.data.list;
        console.log("list",this.list)
      }
      else this.error = res.message;
    },
  },
  computed: {
  },
};
</script>
