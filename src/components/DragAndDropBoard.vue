<template lang="pug">
.drug-and-drop-board
  .drug-and-drop-board__top(data-board-panel)
    slot(name="widgets" :start="start")
      .widget-panel
        .widget(
          v-for="(widget, key) in options.components"
          :key="'widget-' + index"
          @mousedown="start(key, $event)"
        )

  .drug-and-drop-board__area(data-board-area)
    .drug-and-drop-board__box(
      v-for="(item, key) in board.items" :key="key"
      @mousedown="start(item, $event)"
      :data-id="item.key"
    )
      component(:is="item.instance" :class="{'cursor-move': !isLock}")

    .drug-and-drop-board__selection(data-board-selection)
      slot(name="selection")
        .widget-selection
  
    .drug-and-drop-board__lock(data-board-lock)
      slot(name="lock" :lock="switchLock" :isLock="isLock")
        .lock(@click="switchLock") {{ isLock ? 'Unlock' : 'Lock' }}

</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import { Board, BoardItem, BoardOptions } from "@/assets/ts/board.classes.ts";

export default defineComponent({
  props: {
    options: {
      type: Object,
      default: () => ({
        state: {},
        components: {},
        size: { col: 4, row: 3 },
      }),
    },
  },
  data: () => ({
    board: {} as Board,
    grugItem: {} as any,
    eventListenerX: null as any,
    isLock: true,
    panel: null,
  }),
  created() {
    const keys = Object.keys(this.options.components);
    keys.forEach((key: string) => {
      this.options.components[key].instance = key;
    });
  },
  mounted() {
    this.board = new Board(
      this.options as BoardOptions,
      this.$el.querySelector("[data-board-area]"),
      this.$el.querySelector("[data-board-selection] > div"),
      this.$el.querySelector("[data-board-panel] > div")
    );

    this.board.lock();

    this.eventListenerX = this.board.subscribe("change", (items: any) => {
      this.$emit("change", items);
    });
  },
  methods: {
    start(widget: any, event: any) {
      if (this.isLock) return;
      if (!(widget instanceof BoardItem)) {
        const optios = this.options.components[widget];
        this.grugItem = this.board.addItem(widget, optios, event);
      } else {
        this.grugItem = widget;
      }
      this.grugItem.startMove(event);
    },
    switchLock() {
      this.isLock = !this.isLock;
      if (this.isLock) {
        this.board.lock();
      } else {
        this.board.unlock();
      }
    },
  },
  beforeUnmount() {
    this.eventListenerX.unsubscribe();
  },
});
</script>

<style lang="scss" scoped>
.drug-and-drop-board {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  user-select: none;

  .drug-and-drop-board__area {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .drug-and-drop-board__box {
    position: absolute;
    opacity: 0;
  }
}

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
.cursor-move {
  cursor: move;
}
</style>
