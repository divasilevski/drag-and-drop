import { computed } from "vue";
import type { Ref } from "vue";

interface CheckItem {
  checked: boolean;
  value: string;
}

export function progressCheck(input: Ref<string>, content: Ref<CheckItem[]>) {
  return {
    addItem() {
      if (!Array.isArray(content.value)) content.value = [];

      if (input.value) {
        const item: CheckItem = { checked: false, value: input.value };
        content.value.push(item);
        input.value = "";
      }
    },

    toggleItem(item: CheckItem) {
      item.checked = !item.checked;
    },

    removeItem(index: number) {
      content.value.splice(index, 1);
    },

    itemStyle: computed(() => {
      if (!Array.isArray(content.value)) return "";

      const sum = (a: number, b: CheckItem) => a + +b.checked;
      const checked = content.value.reduce(sum, 0);

      return `width: ${(checked / content.value.length) * 100}%;`;
    }),
  };
}
