<template lang="pug">
.cat-widget
  img(:src="content")
  svgCat
</template>

<script lang="ts">
import { defineComponent } from "vue";
import svgCat from "@/assets/svg/svgCat.vue";
import { saveContent } from "./saveContent.setup";
import { randInt } from "./widgets.helpers";

export default defineComponent({
  components: { svgCat },
  setup(_, { attrs }) {
    const content = saveContent(attrs.itemKey as string | undefined);

    if (!content.value) {
      const r = randInt(300, 1000);
      content.value = `https://placekitten.com/${r}/${r}`;
    }

    return { content };
  },
});
</script>

<style lang="scss" scoped>
.cat-widget {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 20px);
  width: calc(100% - 20px);
  border-radius: 10px;
  background: #efdfd2;
  margin: 10px;
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
  pointer-events: none;

  img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    z-index: 1;
  }

  svg {
    position: absolute;
    width: 70%;
    height: 70%;
  }
}
</style>
