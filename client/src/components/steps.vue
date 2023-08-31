<template>
  <div class="h40 flex relative pr-2">
    <div
      class="group flex-1 flex flex-col space-y-3 items-start text-xs first:items-start last:items-end last:absolute last:right-0"
      v-for="(item, index) in step_nodes"
      :key="'tab' + index"
      @tap="switchStep(index)"
      :class="index == step_index ? 'step-active' : ''"
    >
      <div
        class="group-[.step-active]:text-primary h-8 text-sm -translate-x-1/2 group-first:translate-x-0 group-last:translate-x-0 group-[.step-active]:text-base flex items-end group-[.step-active]:font-semibold" 
      >{{ item }}</div>
      <div
        class="flex space-x-2 w-full justify-end items-center pr-3 group-last:pr-0"
      >
        <div class="w-3 h-3 group-[.step-active]:text-primary">
          <svg-success></svg-success>
        </div>
        <div class="h-0.5 bg-gray-200 flex-1 relative group-last:hidden"></div>
      </div>
    </div>
  </div>
</template>

<script>
import svgSuccess from "./svg/svg-success.vue";
import { mapState } from "vuex";
export default {
  props: {
    step_nodes: {
      default: [],
    },
    step_index: {
      default: 0,
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    switchStep(index) {
      this.$emit("switchStep", index);
    },
  },
  components: { svgSuccess },
};
</script>

<style>
</style>
