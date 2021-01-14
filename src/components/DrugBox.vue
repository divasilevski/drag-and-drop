<template lang="pug">
.drug-box(
  @click="number++"
)
  .text( v-text="number")
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data: () => ({
    number: 0,
  }),
  created() {
    setInterval(() => {
      this.number++;
    }, 1000);
  },
});
</script>

<style lang="scss" scoped>
.drug-box {
  background: red;
  width: 100%;
  height: 100%;
  cursor: move;
}
</style>
