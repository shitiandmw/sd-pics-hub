<template>
    <div class="flex items-center justify-center bg-gray-200 ">
      <div class="w-1/3 aspect-square text-gray-400">
        <svgWhat></svgWhat>
      </div>
    </div>
</template>

<script>
import svgWhat from "./svg/svg-what.vue";
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
  computed: {
    
  },
  components: { svgWhat },
};
</script>

<style>
</style>
