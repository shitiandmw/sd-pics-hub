<template>
  <view class="w-full">
     <div class="text-lg mb-2">模式</div>
     <div class="flex space-x-4  mb-4">
      <div class="group overflow-hidden w-36 border border-gray-200 rounded flex h-10 items-center justify-center relative cursor-pointer" :class="type==1?'border-primary text-primary active':''" @click="type=1">
        体验模式
        <div class="w-4 h-4 absolute -bottom-px -right-px invisible group-[.active]:visible"><svgActivetab></svgActivetab></div>
      </div>
      <div class="group overflow-hidden w-36 border border-gray-200 rounded flex h-10 items-center justify-center relative  cursor-pointer" :class="type!=1?'border-primary text-primary active':''"  @click="type=2">
        高级模式
        <div class="w-4 h-4 absolute -bottom-px -right-px invisible group-[.active]:visible"><svgActivetab></svgActivetab></div>
      </div>
     </div>
     <div class="text-lg">上传照片</div>
     <div class="text-sm mb-4 text-gray-500">1张五官清晰的正面照片</div>
     <div class=" mb-2 w-64 h-64 rounded border border-dashed border-gray-300 flex items-center justify-center cursor-pointer" @click="selectImg" v-if="!img">
        <div class="w-10 h-10 text-gray-400">
          <svgImgsAdd></svgImgsAdd>
        </div>
     </div>
     <div class="mb-2 w-64 h-64 rounded border " v-else>
      <image class="w-full h-full" mode="aspectFit" :src="img"></image>
     </div>
     <div class="text-sm mb-2 text-gray-500">样例</div>
     <div class="w-64 flex space-x-2">
      <div class="flex-1 flex items-center flex-col space-y-1">
        <div class="border  aspect-square w-full"></div>
        <div class="text-xs">五官清晰</div>
        <div class="w-4 h-4 rounded-full bg-green-700 p-1 text-white"><svgSuccess></svgSuccess></div>
      </div>
      <div class="flex-1 flex items-center flex-col space-y-1">
        <div class="border  aspect-square w-full"></div>
        <div class="text-xs">不是正面</div>
        <div class="w-4 h-4 rounded-full bg-gray-700 p-1 text-white"><svgClose></svgClose></div>
      </div>
      <div class="flex-1 flex items-center flex-col space-y-1">
        <div class="border  aspect-square w-full"></div>
        <div class="text-xs">太模糊</div>
        <div class="w-4 h-4 rounded-full bg-gray-700 p-1 text-white"><svgClose></svgClose></div>
      </div>
      <div class="flex-1 flex items-center flex-col space-y-1">
        <div class="border  aspect-square w-full"></div>
        <div class="text-xs">有遮挡</div>
        <div class="w-4 h-4 rounded-full bg-gray-700 p-1 text-white"><svgClose></svgClose></div>
      </div>
     </div>
     <lbutton class="shadow-xl mt-6">创建</lbutton>


  </view>
</template>

<script>

import lbutton from "@/components/button.vue";
import svgImgs from "@/components/svg/svg-imgs.vue";
import svgImgsAdd from "@/components/svg/svg-imgs-add.vue";
import svgClose from "@/components/svg/svg-close.vue";
import svgSuccess from "@/components/svg/svg-success.vue";
import svgActivetab from "@/components/svg/svg-activetab.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
      type:1,
      img:"",
    };
  },
  mounted() {
  },
  methods: {
    selectImg(){
      let that = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album','camera'],
          crop:{
            width:500,
            height:500
          },
					success: (res) => {
            console.log(res)
						if (res.tempFilePaths.length > 0) {
							that.img = res.tempFilePaths[0]; 				
						} 	
					}
				});
    }
  },
  computed: {
  },
  components: { svgActivetab,svgImgs,svgSuccess,svgClose,svgImgsAdd,lbutton},
};
</script>
