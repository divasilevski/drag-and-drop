<template lang="pug">
div 
  .board-container
    .board-wrapper
      DragAndDropBoard(:options="options" @change="saveBoard")
        template(#widgets="{start}")
          .widget-panel
            .widget(@mousedown="start('DrugBox', $event)"  style="background: thistle;")
            .widget(@mousedown="start('DrugBox2', $event)" style="background: green;")
            .widget(@mousedown="start('DrugBox3', $event)" style="background: teal;")
            .widget(@mousedown="start('DrugBox4', $event)" style="background: rgb(231, 133, 62);")
        
        template(#lock="{lock, isLock}")
          .lock(@click="lock") {{ isLock ? 'Unlock' : 'Lock' }}

</template>

<script lang="ts">
import { defineComponent } from "vue";
import DragAndDropBoard from "@/components/DragAndDropBoard/index.vue";

export default defineComponent({
  name: "Home",
  components: {
    DragAndDropBoard,
  },
  setup() {
    const state = JSON.parse(localStorage.getItem("bordItems") || "{}");
    const options = {
      components: {
        DrugBox: { size: { col: 1, row: 1 } },
        DrugBox2: { size: { col: 1, row: 2 } },
        DrugBox3: { size: { col: 2, row: 1 } },
        DrugBox4: { size: { col: 2, row: 2 } },
      },
      size: {
        col: 6,
        row: 5,
      },
      state,
    };

    const saveBoard = (items: any) => {
      localStorage.setItem("bordItems", JSON.stringify(items));
    };

    return { options, saveBoard };
  },
});
</script>

<style lang="scss">
.board-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  margin-top: 50px;

  .board-wrapper {
    position: relative;
    width: 800px;
    height: 700px;

    .widget-panel {
      width: 100%;
      display: flex;
      justify-content: center;
      border: 1px dashed white;

      .widget {
        width: 30px;
        height: 30px;
        border-radius: 5px;
        background: #ccc;
        margin: 5px;
        cursor: move;
      }
    }
    .widget-selection {
      border: 2px dashed #ccc;
      border-radius: 10px;
    }
  }

  .lock {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    right: 10px;
    width: 70px;
    padding: 5px;
    margin: 5px;
    font-size: 15px;
    font-weight: bold;
    background: #ccc;
    color: rgb(51, 51, 51);
    border-radius: 10px;
    top: -40px;
    cursor: pointer;

    &:hover {
      background: #bbb;
    }
  }
}
</style>
