<script>
import { mapState } from "vuex";
import svgSuccess from "@/components/svg/svg-success.vue";
import whatImg from "@/components/what-img.vue";
import svgDelete from "@/components/svg/svg-delete.vue";
export default {
  data() {
    return {
      select_id: "",
      list: [],
      error: "",
      cos_host: process.env.VUE_APP_COS_HOST,
      firstload: false,
      moreload: false,
    };
  },
  async mounted() {
    await this.getList();
  },
  methods: {
    async getList() {
      let that = this;
      try {
        const url = "/doppelganger/list";
        const params = {};
        if (that.list && that.list.length > 0) {
          params.last_id = that.list[that.list.length - 1]._id;
        }
        const res = await this.$http.get(url, params, 2);
        console.log("res", res);
        if (res && res.code == 1) {
          if (res.data && res.data.length > 0) {
            that.list = that.list.concat(res.data);
          }
          if (!that.select_id) {
            that.selectItem(that.list[0]);
          }
          console.log("list", that.list);
        } else this.error = res.message;
      } catch (error) {
        that.error = error.message;
        console.log("error", error);
      } finally {
        that.firstload = true;
      }
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
    selectItem(item) {
      console.log(item);
      if(item)
     {
      this.select_id = item._id;
      this.$emit("select", item._id);
     }
    },
    async delItem(item) {
      let that = this;
      uni.showModal({
        title: "提示",
        content: "删除分身后无法恢复，确认删除么？",
        success: async function (res) {
          if (res.confirm) {
            const url = "/doppelganger/del";
            const params = { id: item._id };
            const res = await that.$http.post(url, params, 2);
            if (res && res.code == 1) {
              uni.showToast({
                title: "删除成功",
                icon: "success",
                duration: 2000,
              });
              const _index = that.list.findIndex((s) => s._id == item._id);
              if (_index >= 0) that.list.splice(_index, 1);
              if(that.select_id == item._id)
              {
                that.select_id = "";
                this.$emit("select", "");
              }
            } else {
              uni.showToast({
                title: res.message,
                icon: "error",
                duration: 4000,
              });
            }
          } else if (res.cancel) {
          }
        },
      });
    },
    refreshList() {
      this.list = [];
      this.getList();
    },
  },
  computed: {},
  components: {
    svgSuccess,
    whatImg,
    svgDelete,
  },
};
</script>
  
<template>

<scroll-view
          class="h-full"
          scroll-y="true"
          @scrolltolower="moreList"
          @refresherrefresh="refreshList"
        >
    <view class="w-full grid grid-cols-2 gap-3">
        <template v-for="(item,index) in list" >
            <div  :key="'item'+index" class="flex flex-col group  " v-bind:class='select_id==item._id?"active":""' >
                <div @tap="selectItem(item)" class="w-full aspect-square relative  rounded-xl  clear-both overflow-hidden ">
                    <whatImg class="w-full h-full rounded-xl border border-gray-200  group-[.active]:border-2 group-[.active]:border-primary" v-if="!item.train_imgs || item.train_imgs.length<=0"></whatImg>
                    <image v-else lazy-load="true" mode="aspectFill"  :src="cos_host+item.train_imgs[0].compress_img"
                    class="w-full h-full rounded-xl float-left border border-gray-200 group-[.active]:border-2 group-[.active]:border-primary " 
                    alt="">
                    <div class="flex items-center justify-center w-6 h-5 absolute bottom-0  right-0 invisible group-[.active]:visible rounded-tl-xl bg-primary text-white">
                        <div class="w-3 h-3"><svgSuccess></svgSuccess></div>
                    </div>
                </div>
                <div class="flex text-sm items-center h-8">
                    <div class="flex-1  text-gray-500">{{item.create_time_format}}</div> 
                    <div class="w-8 h-8 p-2 cursor-pointer text-gray-500" @tap="delItem(item)"><svgDelete></svgDelete></div>
                </div>
            </div>
        </template>
    </view>

</scroll-view>
</template>
  
