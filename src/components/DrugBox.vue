<template lang="pug">
.drug-box(@click="number++")
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
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: move;
  padding: 10px;

  .text {
    width: 100%;
    height: 100%;
    background: grey;
    border-radius: 10px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
