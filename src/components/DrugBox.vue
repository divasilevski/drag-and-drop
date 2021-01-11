<template lang="pug">
.drug-box(
  @click="number++"
  draggable="true"
  @dragstart="$emit('dragstart', $event)"
  @dragend="$emit('dragend', $event)"
)
  .text( v-text="number")
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data: () => ({
    number: 0,
  }),
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
