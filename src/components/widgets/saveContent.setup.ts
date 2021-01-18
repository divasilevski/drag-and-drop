import { getCurrentInstance, onMounted, ref, watch } from "vue";

export function saveContent() {
  const content = ref();
  let key: string | null = null;

  onMounted(() => {
    const internalInstance = getCurrentInstance() as any;
    const $el = internalInstance.ctx.$el;
    key = $el.closest("[data-board-key]").dataset.boardKey;

    if (key) {
      const storage = localStorage.getItem(key);
      content.value = storage ? JSON.parse(storage) : "";
    }
  });

  watch(content, (value, prevValue) => {
    if (key !== null && prevValue !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });

  return content;
}

export function removeContent(itemKey: string) {
  localStorage.removeItem(itemKey);
}
