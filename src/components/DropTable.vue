<template lang="pug">
.drop-table
  .widgets
    .widget(
      v-for="(widget, index) in widgets" :key="'widget-' + index"
      @mousedown="start(widget, $event)"
    ) {{ widget.size.col + 'x' + widget.size.row}}

  .drop-aria
    .absolute-box(
      v-for="(item, key) in board.items" :key="key"
      @mousedown="start(item, $event)"
      :data-id="item.key"
    )
      component(:is="item.instance" )
    
    .box-selector

</template>

<script lang="ts">
import { defineComponent } from "vue";
import DrugBox from "./DrugBox.vue";
import DrugBox2 from "./DrugBox2.vue";
import DrugBox3 from "./DrugBox3.vue";
import DrugBox4 from "./DrugBox4.vue";
import { Board, BoardItem, BoardOptions } from "@/assets/ts/board.classes.ts";

interface Size {
  col: number;
  row: number;
}

const SIZE = {
  col: 6,
  row: 5,
};

export default defineComponent({
  props: {
    options: {
      type: Object,
      default: () => ({
        size: {
          col: 4,
          row: 3,
        },
        state: {},
      }),
    },
  },
  components: {
    "drug-box": DrugBox,
    "drug-box2": DrugBox2,
    "drug-box3": DrugBox3,
    "drug-box4": DrugBox4,
  },
  data: () => ({
    widgets: [
      { instance: "drug-box", size: { col: 1, row: 1 } },
      { instance: "drug-box2", size: { col: 1, row: 2 } },
      { instance: "drug-box3", size: { col: 2, row: 1 } },
      { instance: "drug-box4", size: { col: 2, row: 2 } },
    ],
    board: {} as Board,
    grugItem: {} as any,
    eventListener: null as any,
  }),
  mounted() {
    this.board = new Board(
      this.options as BoardOptions,
      this.$el.querySelector(".drop-aria"),
      this.$el.querySelector(".box-selector"),
      this.$el.querySelector(".widgets")
    );

    this.eventListener = this.board.subscribe("change", (items: any) => {
      this.$emit("change", items);
    });
  },
  methods: {
    start(widget: any, event: any) {
      if (!(widget instanceof BoardItem)) {
        this.grugItem = this.board.addItem(widget.instance, widget, event);
      } else {
        this.grugItem = widget;
      }
      this.grugItem.startMove(event);
    },
  },
  beforeUnmount() {
    this.eventListener.unsubscribe();
  },
});
</script>

<style lang="scss">
$col: 4;
$row: 3;

.drop-table {
  width: 100%;
  height: 100%;
  user-select: none;

  .widgets {
    width: 100%;
    display: flex;
    justify-content: center;
    border: 1px dashed white;

    .widget {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ccc;
      width: 40px;
      height: 40px;
      margin: 5px;
      cursor: move;
    }
  }

  .drop-aria {
    position: relative;
    width: 100%;
    margin: 0 auto;
    width: 800px;
    height: 600px;

    .drop-aria__grid {
      position: absolute;
      display: grid;
      grid-template-columns: repeat($col, 1fr);
      width: 100%;
      height: 100%;

      .drop-aria__box {
        position: relative;
        width: 200px;
        height: 200px;
        user-select: none;
        // border: 1px solid #ddd;
      }
    }
  }

  .box-selector {
    position: absolute;
    // background: rgb(238, 237, 237);
    border: 2px dashed #ccc;
    border-radius: 10px;
  }
  .box-wrapper {
    position: absolute;

    z-index: 10;
  }
  .absolute-box {
    position: absolute;
    opacity: 0;
  }
}
</style>
