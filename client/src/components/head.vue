<template>
  <view :style="head_margin_top" class=" invisible">
    
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      head_margin_top: "",
    };
  },
  mounted() {
    this.getPhoneHeight();
  },
  methods: {
    getPhoneHeight() {
      //获取高度
      let that = this;
      uni.getSystemInfo({
        success: function (res) {
          that.head_margin_top = `height:${res.statusBarHeight}px`;
        },
      });
    },
  },
  computed: {
    ...mapState("socket", ["state"]),
  },
};
</script>

<style>
.rounded-left {
  clip-path: inset(0% 0% 0% 0% round 0% 0% 0% 85%);
}
.rounded-right {
  clip-path: inset(0% 0% 0% 0% round 0% 0% 85% 0);
}
.rounded-sm-left {
  background: radial-gradient(22px at left bottom, transparent 50%, white 50%);
  transform: rotate(0deg);
  margin-left: 0.3rem;
  margin-top: -0.5rem;
}
.rounded-sm-right {
  background: radial-gradient(22px at right bottom, transparent 50%, white 50%);
  margin-right: 0.54rem;
  margin-top: -0.5rem;
}
</style>
