<template lang="pug">
div 
  .board-container
    .board-wrapper
      DragAndDropBoard(:options="options" @save="saveBoard" @remove="removeItem")
        template(#widgets="{start}")
          .widget-panel
            .widget(@mousedown="start('Cat', $event)" style="background: #efdfd2;")
            .widget(@mousedown="start('Note', $event)" style="background: #f7efac;")
            .widget(@mousedown="start('Clock', $event)" style="background: #d4daae;")
            .widget(@mousedown="start('ProgressCheck', $event)" style="background: #bddfe9;")
        
        template(#lock="{lock, isLock}")
          .lock(@click="lock") {{ isLock ? 'Unlock' : 'Lock' }}

        template(#default)
          Cat(name="Cat" size="2:2")
          Note(name="Note" size="2:2")
          Clock(name="Clock" size="2:1")
          ProgressCheck(name="ProgressCheck" size="2:3")

</template>

<script lang="ts">
import { defineComponent } from "vue";
import DragAndDropBoard from "@/components/DragAndDropBoard/index.vue";

// Widgets
import Cat from "@/components/widgets/Cat.vue";
import Note from "@/components/widgets/Note.vue";
import Clock from "@/components/widgets/Clock.vue";
import ProgressCheck from "@/components/widgets/ProgressCheck.vue";

import { removeContent } from "@/components/widgets/saveContent.setup";

export default defineComponent({
  name: "Home",
  components: {
    DragAndDropBoard,

    Cat,
    Note,
    Clock,
    ProgressCheck,
  },
  setup() {
    const state = JSON.parse(localStorage.getItem("bordItems") || "{}");
    const options = {
      size: { col: 6, row: 5 },
      state,
    };

    const saveBoard = (items: any) => {
      localStorage.setItem("bordItems", JSON.stringify(items));
    };

    return { options, saveBoard, removeItem: removeContent };
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
