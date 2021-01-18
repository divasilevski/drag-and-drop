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
      :data-board-key="item.key"
    )
      ItemRender(:slot="findSlot(item.instance)" :class="{'cursor-move': !isLock}")

    .drug-and-drop-board__selection(data-board-selection)
      slot(name="selection")
        .widget-selection
  
    .drug-and-drop-board__lock(data-board-lock)
      slot(name="lock" :lock="switchLock" :isLock="isLock")
        .lock(@click="switchLock") {{ isLock ? 'Unlock' : 'Lock' }}

</template>

<script lang="ts">
import { Board } from "./Board.class";
import { defineAsyncComponent, defineComponent, h, warn } from "vue";
import { BoardOptions } from "./board.interfaces";
import { BoardItem } from "./BoardItem.class";

export default defineComponent({
  components: {
    ItemRender: ({ slot }) => {
      // console.log(slot);
      return h("div", {}, [slot]);
    },
  },
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
    events: [] as any[],
    isLock: true,
    panel: null,
  }),
  mounted() {
    this.board = new Board(
      this.options as BoardOptions,
      this.$el.querySelector("[data-board-area]"),
      this.$el.querySelector("[data-board-selection] > div"),
      this.$el.querySelector("[data-board-panel] > div")
    );

    this.board.lock();

    const changeListener = this.board.subscribe("change", (items: any) => {
      this.$emit("change", items);
    });

    const removeListener = this.board.subscribe("remove", (itemKey: any) => {
      this.$emit("remove", itemKey);
    });

    this.events.push(changeListener, removeListener);
  },
  methods: {
    start(widget: any, event: any) {
      if (this.isLock) return;
      if (!(widget instanceof BoardItem)) {
        const slot = this.findSlot(widget);

        console.log(slot);

        if (slot) {
          const size = slot.props.size.split(":");

          const options = {
            size: {
              col: +size[0],
              row: +size[1],
            },
            instance: widget,
          };
          this.grugItem = this.board.addItem(widget, options, event);
        }
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
    findSlot(key: string) {
      const slots = (this.$slots as any).default();
      const findedSlot = slots.find((el: any) => el.props.name === key);
      if (findedSlot) {
        return findedSlot;
      } else {
        return Error("slot not find");
      }
    },
  },
  beforeUnmount() {
    this.events.forEach((event: any) => event.unsubscribe());
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

  .drug-and-drop-board__box > div {
    width: 100%;
    height: 100%;
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
