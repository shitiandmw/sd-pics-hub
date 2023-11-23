<template>
    <steps
      :step_nodes="step_nodes"
      :step_index="step_index"
      @switchStep="switchStep"
    ></steps>
</template>

<script>
import steps from "@/components/steps.vue";
export default {
  props: {
    step_index: {
      default: 0,
    },
  },
  data() {
    return {
      step_nodes: ["1. 选择模板", "2. 制作数字分身", "3. 等待出片"],
    };
  },
  onLoad() {},
  methods: {
    switchStep: function (index) {
       this.$emit("switchStep", index);
    },
  },
  components: { steps },
};
</script>

<style>
</style>
