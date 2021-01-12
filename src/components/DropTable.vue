<template lang="pug">
.drop-table
  .widgets
    .widget(
      v-for="(widget, index) in widgets" :key="'widget-' + index"
      draggable="true"
      @dragstart="start(widget)"
      @dragend="end(widget)"
    ) {{ widget.size.col + 'x' + widget.size.row}}
    .basket(
      @dragenter="enter(1000, $event)"
    )

  .drop-aria
    .drop-aria__grid
      .drop-aria__box(
        v-for="(_, index) in count" :key="'box-' + index"
        @dragenter="enter(index, $event)"
      )
        template(v-if="table[index]")
          .box-wrapper(:style="wrapStyle(table[index].size)")
            component(
              :is="table[index].instance"
              @dragstart.capture="start(table[index])"
              @dragend="end(table[index])"
            )
        template(v-if="index === drugArea")
          .box-selector(:style="wrapStyle(selectedWidget?.size)")

</template>

<script lang="ts">
import { defineComponent } from "vue";
import DrugBox from "./DrugBox.vue";

type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
};

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
    indexes: [] as any, // Отвечают чисто за место
    table: [] as any, // Отвечают за место под солнцем
    drugArea: null as number | null,
    selectedWidget: null as Widget | null,
  }),
  computed: {
    count() {
      return SIZE.row * SIZE.col;
    },
  },
  methods: {
    start(widget: Widget) {
      this.selectedWidget = JSON.parse(JSON.stringify(widget));
      // По хорошему создавать ивент ентера и енда
    },
    enter(index: number, event: HTMLElementEvent<HTMLTextAreaElement>) {
      if (!this.selectedWidget) return;
      const size: Size = this.selectedWidget.size;

      if (index === 1000) {
        for (let i = 0; i < size.col; i++) {
          for (let j = 0; j < size.row; j++) {
            if (this.selectedWidget.index !== undefined) {
              const index = this.selectedWidget.index + i + SIZE.col * j;
              this.indexes[index] = null;
            }
          }
        }
        this.table[this.selectedWidget.index] = null;
        this.drugArea = null;
        return;
      }

      this.drugArea = this.calculateIndex(index, size);

      for (let i = 0; i < size.col; i++) {
        for (let j = 0; j < size.row; j++) {
          const index = this.drugArea + i + SIZE.col * j;
          if (this.indexes[index]) {
            this.drugArea = null;
            return;
          }
        }
      }
    },
    end(index: number) {
      if (this.drugArea !== null) {
        if (!this.selectedWidget) return;
        const size: Size = this.selectedWidget.size;
        for (let i = 0; i < size.col; i++) {
          for (let j = 0; j < size.row; j++) {
            if (this.selectedWidget.index !== undefined) {
              const index = this.selectedWidget.index + i + SIZE.col * j;
              this.indexes[index] = null;
            }
            const index = this.drugArea + i + SIZE.col * j;
            this.indexes[index] = this.selectedWidget.instance;
          }
        }
        if (this.selectedWidget.index !== undefined) {
          this.table[this.selectedWidget.index] = null;
        }
        this.selectedWidget.index = this.drugArea;
        this.table[this.drugArea] = this.selectedWidget;
        this.drugArea = null;
      }
    },

    calculateIndex(index: number, size: Size): number {
      const currentRow = Math.floor(index / SIZE.col);
      const currentCol = index % SIZE.col;
      const maxRow = SIZE.row - size.row;
      const maxCol = SIZE.col - size.col;

      if (currentRow > maxRow) {
        return this.calculateIndex(index - SIZE.col, size);
      }
      if (currentCol > maxCol) {
        return this.calculateIndex(index - 1, size);
      }

      return index;
    },

    wrapStyle(size: Size): any {
      if (!size) return "";
      return `
        width: ${200 * size.col - 20}px;
        height: ${200 * size.row - 20}px;
      `;
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

    .basket {
      width: 50px;
      border: 2px dashed #232323;
      margin-left: 50px;
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
        // border: 1px solid #ddd;
      }
    }
  }

  .box-selector {
    position: absolute;
    background: #ccc;
    padding: 10px;
  }
  .box-wrapper {
    position: absolute;
    padding: 10px;
    z-index: 10;
  }
}
</style>
