<template lang="pug">
.note-widget
  .note-widget__textarea(
    contenteditable="true"
    spellcheck="false"
    v-text="content"
    @input="content = $event.target.textContent"
    placeholder="Add something..."
  )
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { saveContent } from "./saveContent.setup";

export default defineComponent({
  setup: () => ({
    content: saveContent(),
  }),
});
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Caveat&display=swap");

.note-widget {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  background: #f7efac;
  border-radius: 10px;
  margin: 10px;

  .note-widget__textarea {
    font-family: "Caveat", cursive;
    font-size: 24px;
    width: 80%;
    height: 90%;
    text-align: left;

    &:focus,
    &:active {
      outline: none;

      &:empty:before {
        content: "";
      }
    }

    // placeholder
    &:empty:before {
      content: attr(placeholder);
      pointer-events: none;
      display: block;
    }
  }
}
</style>
