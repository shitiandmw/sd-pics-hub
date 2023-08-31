<template>
  <view
    class="w-full h-full fixed top-0 left-0 flex flex-col-reverse"
    :class="input ? '' : 'hidden'"
  >
    <view
      class="w-full h-full bg-black opacity-50 fixed z-40"
      @click="input = false"
    ></view>
    <view
      class="animate-popup2 bg-white rounded-none rounded-t-xl z-50 bottom-0 w-full min-h-96 relative pt-2 max-h-9/10"
    >
      <view
        class="icon absolute right-4 top-4 w-8 h-8 z-50 p-2 bg-white shadow-lg rounded-full text-gray-500 cursor-pointer"
        @click="input = false"
      >
        <svg-close></svg-close>
      </view>
      <view class="pt-2 h-full"><slot></slot></view>
    </view>
  </view>
</template>

<script>
import svgClose from "./svg/svg-close.vue";
export default {
  props: {
    value: Boolean,
  },
  model: {
    prop: "value", // 指定 v-model 要绑定的参数叫什么名字，来自于 props 中定义的参数
    event: "change", // 指定要触发的事件名字，将被用于 $emit
  },
  data() {
    return {
      show: this.popup_show,
    };
  },
  onLoad() {},
  methods: {},
  mounted() {},
  computed: {
    input: {
      // 这里的计算属性使用了 getter、setter，可以简化代码
      // 可参见链接 https://cn.vuejs.org/v2/guide/computed.html#%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7%E7%9A%84-setter
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val); // 触发
      },
    },
  },
  components: { svgClose },
};
</script>

<style></style>
