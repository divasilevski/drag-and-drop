<template lang="pug">
.drop-table
  .widgets
    .widget(
      v-for="(widget, index) in widgets" :key="'widget-' + index"
      @mousedown="start(widget, $event)"
    ) {{ widget.size.col + 'x' + widget.size.row}}

  .drop-aria
    .drop-aria__grid
      .drop-aria__box(
        v-for="(_, index) in count" :key="'box-' + index"
      )
    
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
import { Board, BoardItem } from "@/assets/ts/board.classes.ts";

interface Size {
  col: number;
  row: number;
}

interface Widget {
  instance: string;
  size: Size;
  index: number;
}

const SIZE = {
  col: 4,
  row: 3,
};

export default defineComponent({
  components: {
    "drug-box": DrugBox,
  },
  data: () => ({
    widgets: [
      { instance: "drug-box", size: { col: 1, row: 1 } },
      { instance: "drug-box", size: { col: 1, row: 2 } },
      { instance: "drug-box", size: { col: 2, row: 1 } },
      { instance: "drug-box", size: { col: 2, row: 2 } },
    ],
    board: {} as Board,
    grugItem: {} as any,
  }),
  mounted() {
    this.board = new Board(
      SIZE,
      this.$el.querySelector(".drop-aria"),
      this.$el.querySelector(".box-selector"),
      this.$el.querySelector(".widgets")
    );
  },
  computed: {
    count() {
      return SIZE.row * SIZE.col;
    },
  },
  methods: {
    start(widget: any, event: any) {
      if (!(widget instanceof BoardItem)) {
        this.grugItem = this.board.addItem(widget.instance, widget);
      } else {
        this.grugItem = widget;
      }
      this.grugItem.startMove(event);
    },
  },
});
</script>

<style lang="scss">
$col: 4;
$row: 3;

.drop-table {
  width: 100%;
  height: 100%;

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
        border: 1px solid #ddd;
      }
    }
  }

  .box-selector {
    position: absolute;
    background: #ccc;
  }
  .box-wrapper {
    position: absolute;
    z-index: 10;
  }
  .absolute-box {
    position: absolute;
  }
}
</style>
