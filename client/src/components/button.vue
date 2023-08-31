<template>
    <button
      class="rounded-lg border-0 after:border-0 bg-primary active:opacity-90 text-white h-14 flex justify-center items-center w-full"
      @tap="button_click"
    >
      <slot></slot>
    </button>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    button_click() {
      this.$emit("click");
    },
  },
  computed: {},
};
</script>

<style>
</style>
