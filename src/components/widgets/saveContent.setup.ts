import { ref, watch } from "vue";

export function saveContent(key: string | undefined) {
  const content = ref();

  if (key !== undefined) {
    const storage = localStorage.getItem(key);
    content.value = storage ? JSON.parse(storage) : "";
  }

  watch(content, (value, prevValue) => {
    if (key !== undefined && prevValue !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });

  return content;
}

export function removeContent(itemKey: string) {
  localStorage.removeItem(itemKey);
}
