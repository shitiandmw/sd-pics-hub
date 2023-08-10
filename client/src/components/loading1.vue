<template>
  <view class="animate-pulse">
            <div class="py-8 px-8 bg-white flex items-center cursor-pointer border-b border-gray-100" @tap="goDetail">
                <div class="w-18 h-18 rounded-md bg-gray-100 " alt=""></div>
                <div class="flex-1 ml-6">
                    <div class="w-24 h-8 bg-gray-100"></div>
                    <div class="w-64 h-6 mt-2 bg-gray-100"></div>
                </div>
            </div>
            <div class=" bg-white h-12 px-4 text-lg flex items-center cursor-pointer" @tap="editRemark">
                 <div class="w-full h-6  bg-gray-100"></div>
            </div>


            <div class="h-14 flex items-center px-4 space-x-2 mt-2 justify-center bg-white">
               <div class="w-full h-6  bg-gray-100"></div>
            </div>
            
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style>

</style>
