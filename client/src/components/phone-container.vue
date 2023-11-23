<template>
  <view class="phone-container">
    <slot></slot>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad() {},
  methods: {
    safariHacks() {
    //   let windowsVH = window.innerHeight / 100;
    //   document
    //     .querySelector(".phone-container")
    //     .style.setProperty("--vh", windowsVH + "px");
    //   window.addEventListener("resize", function () {
    //     document
    //       .querySelector(".phone-container")
    //       .style.setProperty("--vh", windowsVH + "px");
    //   });
    },
  },
  mounted() {
    this.safariHacks();
  },
};
</script>

<style>
</style>
