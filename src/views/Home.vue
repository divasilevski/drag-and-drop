<template lang="pug">
div 
  .board-container
    .board-wrapper
      DragAndDropBoard(:options="options" @change="saveBoard" @remove="removeItem")
        template(#widgets="{start}")
          .widget-panel
            .widget(@mousedown="start('DrugBox1', $event)" style="background: thistle;")
            .widget(@mousedown="start('DrugBox2', $event)" style="background: green;")
            .widget(@mousedown="start('DrugBox3', $event)" style="background: teal;")
            .widget(@mousedown="start('DrugBox4', $event)" style="background: rgb(231, 133, 62);")
            
            .widget(@mousedown="start('Note', $event)" style="background: #f7efac;")
            .widget(@mousedown="start('Clock', $event)" style="background: #d4daae;")
        
        template(#lock="{lock, isLock}")
          .lock(@click="lock") {{ isLock ? 'Unlock' : 'Lock' }}

        template(#default)
          DrugBox1(name="DrugBox1" size="1:1")
          DrugBox2(name="DrugBox2" size="1:2")
          DrugBox3(name="DrugBox3" size="2:1")
          DrugBox4(name="DrugBox4" size="2:2")
          
          Note(name="Note" size="2:2")
          Clock(name="Clock" size="2:1")

</template>

<script lang="ts">
import { defineComponent } from "vue";
import DragAndDropBoard from "@/components/DragAndDropBoard/index.vue";

import DrugBox from "@/components/widgets/DrugBox.vue";
import DrugBox2 from "@/components/widgets/DrugBox2.vue";
import DrugBox3 from "@/components/widgets/DrugBox3.vue";
import DrugBox4 from "@/components/widgets/DrugBox4.vue";

// Widgets
import Note from "@/components/widgets/Note.vue";
import Clock from "@/components/widgets/Clock.vue";

import { removeContent } from "@/components/widgets/saveContent.setup";

export default defineComponent({
  name: "Home",
  components: {
    DragAndDropBoard,

    DrugBox1: DrugBox,
    DrugBox2,
    DrugBox3,
    DrugBox4,

    Note,
    Clock,
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
