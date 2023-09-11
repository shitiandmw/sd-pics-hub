<template>
  <view class="w-full">
     <div class="text-lg mb-2">模式</div>
     <div class="flex space-x-4  mb-4">
      <div class="overflow-hidden w-36 border border-gray-200 rounded flex h-10 items-center justify-center">体验模式</div>
      <div class=" overflow-hidden w-36 border rounded flex h-10 items-center justify-center relative border-primary text-primary active " >
        高级模式
        <div class="w-4 h-4 absolute -bottom-px -right-px"><svgActivetab></svgActivetab></div>
      </div>
     </div>
     <div class="text-lg">上传照片</div>
     <div class="text-sm mb-2 text-gray-500">1张五官清晰的正面照片</div>

  </view>
</template>

<script>
import svgActivetab from "@/components/svg/svg-activetab.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  },
  computed: {
  },
  components: { svgActivetab},
};
</script>
