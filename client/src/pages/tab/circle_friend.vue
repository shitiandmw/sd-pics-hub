<template>
	<view class="phone-container">
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
    goChat: function () {
      console.log("dsfsdfsdfs");
      uni.navigateTo({
        url: "/pages/tab/message",
      });
    },
  },
};
</script>

<style>

</style>
