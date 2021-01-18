<template lang="pug">
.note-widget
  .note-widget__wrapper(v-if="content !== undefined")
    .note-widget__textarea(
      contenteditable="true"
      spellcheck="false"
      v-html="content"
      v-once
      @input="content = $event.target.innerHTML"
      @focus="focus = true"
      @blur="focus = false"
    )
    .note-widget__placeholder(v-if="placeholder") Add something...
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { saveContent } from "./saveContent.setup";

export default defineComponent({
  setup() {
    const focus = ref(false);
    const content = saveContent();
    const placeholder = computed(() => {
      const cv = content.value;
      return !focus.value && (cv === "<div><br></div>" || cv === "<br>" || !cv);
    });
    return { focus, placeholder, content };
  },
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
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);

  font-family: "Caveat", cursive;
  font-size: 24px;
  text-align: left;

  .note-widget__wrapper {
    position: relative;
    width: 80%;
    height: 90%;

    .note-widget__textarea {
      width: 100%;
      height: 100%;
      overflow: hidden;

      &:focus,
      &:active {
        outline: none;
      }

      // placeholder
      &:empty:before {
        content: attr(placeholder);
        pointer-events: none;
        display: block;
      }
    }
  }

  .note-widget__placeholder {
    position: absolute;
    top: 0;
  }
}
</style>
