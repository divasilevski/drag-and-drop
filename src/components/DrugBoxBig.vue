<template lang="pug">
.drug-box-big(
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
.drug-box-big {
  background: green;
  width: 200px;
  height: 50px;
  cursor: move;
}
</style>
