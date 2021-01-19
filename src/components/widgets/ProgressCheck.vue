<template lang="pug">
.progress-check-widget
  .progress-check-widget__wrapper(v-if="content !== undefined")
    input(
      placeholder="To do:"
      spellcheck="false"
      @keydown.enter="addItem()"
      v-model.trim="input"
    )
    .progress-check-widget__checkboxes
      .progress-check-widget__checkbox(
        v-for="(item, index) in content" 
        :key="'progress-checkbox-' + index"
      )
        .progress-check-widget__text(
          :class="{checked: item.checked}"
          @click="toggleItem(item)"
        ) {{ item.value }}
        .progress-check-widget__delete(
          @click="removeItem(index)"
        ) x
    .progress-check-widget__progress(:style="itemStyle")
      | ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿

</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { saveContent } from "./saveContent.setup";
import { progressCheck } from "./progressCheck.setup";

export default defineComponent({
  setup(_, { attrs }) {
    const input = ref();
    const content = saveContent(attrs.itemKey as string | undefined);

    return { input, content, ...progressCheck(input, content) };
  },
});
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat&display=swap");

.progress-check-widget {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  background: #bddfe9;
  border-radius: 10px;
  margin: 10px;
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);

  font-family: "Caveat", cursive;
  font-size: 24px;
  text-align: left;

  .progress-check-widget__wrapper {
    position: relative;
    width: 80%;
    height: 90%;
    overflow: hidden;

    input {
      background: transparent;
      border: none;
      width: 100%;
      height: 30px;
      font-size: 25px;

      &:focus,
      &:active {
        outline: none;
      }

      &::placeholder {
        color: #2c3e50;
        text-decoration: underline;
      }

      &:empty:focus::placeholder {
        opacity: 0;
      }
    }

    .progress-check-widget__checkboxes {
      height: calc(100% - 50px);

      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 0px;
        background: transparent;
      }
      -ms-overflow-style: none;
      scrollbar-width: none;

      .progress-check-widget__checkbox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        width: 100%;
        word-break: break-word;

        .progress-check-widget__text {
          cursor: pointer;
          padding-right: 5px;

          &.checked {
            text-decoration: line-through;
          }
        }

        .progress-check-widget__delete {
          text-align: right;
          text-decoration: none;
          cursor: pointer;
        }
      }
    }

    .progress-check-widget__progress {
      position: absolute;
      color: #85cbe0;
      overflow: hidden;

      font-size: 16px;
      bottom: 0px;
      width: 0%;
      transition: 0.4s;
      letter-spacing: -5px;
      font-weight: bold;
    }
  }
}
</style>
