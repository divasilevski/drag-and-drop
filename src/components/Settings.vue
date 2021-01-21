<template lang="pug">
.settings
  .settings__head
    .settings__close(@click="isShow = !isShow")
  .settings__body(v-show="isShow")
    form
      fieldset
        legend pushsing
        select(@input="$emit('pushing', $event.target.value)")
          option none
          option(v-for="mode in PushingBoard.pushing") {{ mode }}
      fieldset
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { PushingBoard } from "@/components/DragAndDropBoard/PushingBoard.class.ts";

export default defineComponent({
  setup() {
    const isShow = ref(true);
    return { PushingBoard, isShow };
  },
});
</script>

<style lang="scss" scoped>
.settings {
  z-index: 80;
  position: fixed;
  top: 20px;
  left: 20px;
  background: white;
  border: 1px solid black;
  width: 200px;
  height: auto;

  .settings__head {
    position: relative;
    width: 100%;
    height: 20px;

    .settings__close {
      position: absolute;
      cursor: pointer;
      width: 15px;
      top: 0;
      right: 0;
      height: 20px;
      width: 20px;

      &::before {
        content: "";
        position: absolute;
        background: black;
        right: 5px;
        top: 9px;
        height: 2px;
        width: 15px;
      }
    }
  }

  .settings__body {
    height: 100px;
    border-top: 1px solid gray;

    form {
      padding: 5px;

      fieldset {
        margin-bottom: 10px;

        legend {
          text-align: left;
        }

        select {
          width: 100%;
        }
      }
    }
  }
}
</style>
