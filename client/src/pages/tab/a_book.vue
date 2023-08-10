<template>
	<view class="phone-container p-0">
    <head-bar></head-bar>
		<div class="head-util px-4">
			<div class="w-7 h-7" @tap="back"></div>
      <div class="flex-1 text-center">通讯录</div>
      <image class="w-5 h-5 box-content p-2 pr-0" src="/static/icon/icon-adduser-2.png" alt=""  @tap="newUser">
		</div>
		<scroll-view class="flex-1"  scroll-y="true" >
       <div class="session py-3 px-3 flex items-center bg-white active:bg-gray-50 border-b border-gray-100" @tap="newUserList">
          <div class=" bg-amber-600 w-10 h-10 rounded-md flex items-center justify-center" >
            <image class="w-5 h-5" src="/static/icon/icon-adduser.png"></image>
          </div>
          <div class="flex-1 ml-3">
            <div class="flex items-center  mb-0.5">
              <div class="text-md  text-gray-700 flex-1">新的朋友</div>
            </div>
          </div>
      </div>
      <div class="">
      <div class="h-10 flex items-center pl-3">
        A
      </div>
        <div class="session py-3 px-3 flex items-center bg-white active:bg-gray-50 border-b border-gray-100" @tap="abookDetail" >
          <image class=" bg-gray-200 w-10 h-10 rounded-md" src="/static/user2.png"></image>
          <div class="flex-1 ml-3">
            <div class="flex items-center  mb-0.5">
              <div class="text-md  text-gray-700 flex-1">系统通知</div>
            </div>
          </div>
        </div>
        <div class="session py-3 px-3 flex items-center bg-white active:bg-gray-50 border-b border-gray-100" >
          <image class=" bg-gray-200 w-10 h-10 rounded-md" src="/static/user1.png"></image>
          <div class="flex-1 ml-3">
            <div class="flex items-center  mb-0.5">
              <div class="text-md  text-gray-700 flex-1">疯狂生活小镇</div>
            </div>
          </div>
        </div>
        
        <div class="session py-3 px-3 flex items-center bg-white active:bg-gray-50 border-b border-gray-100" >
          <image class=" bg-gray-200 w-10 h-10 rounded-md" src="/static/user2.png"></image>
          <div class="flex-1 ml-3">
            <div class="flex items-center  mb-0.5">
              <div class="text-md  text-gray-700 flex-1">啦啦啦啦</div>
            </div>
          </div>
        </div>
      </div>
      <div class="">
      <div class=" h-10 flex items-center pl-3">
        B
      </div>
        <div class="session py-3 px-3 flex items-center bg-white active:bg-gray-50 border-b border-gray-100" >
          <image class=" bg-gray-200 w-10 h-10 rounded-md" src="/static/user2.png"></image>
          <div class="flex-1 ml-3">
            <div class="flex items-center  mb-0.5">
              <div class="text-md  text-gray-700 flex-1">暴走漫画</div>
            </div>
          </div>
        </div>
        <div class="session py-3 px-3 flex items-center bg-white active:bg-gray-50 border-b border-gray-100" >
          <image class=" bg-gray-200 w-10 h-10 rounded-md" src="/static/user1.png"></image>
          <div class="flex-1 ml-3">
            <div class="flex items-center  mb-0.5">
              <div class="text-md  text-gray-700 flex-1">百家乐</div>
            </div>
          </div>
        </div>
        
        <div class="session py-3 px-3 flex items-center bg-white active:bg-gray-50 border-b border-gray-100" >
          <image class=" bg-gray-200 w-10 h-10 rounded-md" src="/static/user2.png"></image>
          <div class="flex-1 ml-3">
            <div class="flex items-center  mb-0.5">
              <div class="text-md  text-gray-700 flex-1">Bryan</div>
            </div>
          </div>
        </div>
      </div>
		</scroll-view>
        <tab-bar :selectIndex="1"></tab-bar>
	</view>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello",
    };
  },
  onLoad() {},
  methods: {
    newUserList:function(){
      uni.navigateTo({
        url: "/pages/other/new_user_list",
      });
      
    },
    
    newUser:function(){
      uni.navigateTo({
        url: "/pages/other/new_user",
      });
    },

    abookDetail:function(){
      uni.navigateTo({
        url: "/pages/other/book_detail",
      });
    }
  },
};
</script>

<style>
</style>
