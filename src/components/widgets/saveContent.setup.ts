import { ref, watch } from "vue";

export function saveContent(key: string | undefined) {
  const content = ref();

  if (key !== undefined) {
    const storage = localStorage.getItem(key);
    content.value = storage ? JSON.parse(storage) : "";
  }

  function sendToStorage(value: any, prevValue: any) {
    if (key !== undefined && prevValue !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  watch(content, sendToStorage, { deep: true });

  return content;
}

export function removeContent(itemKey: string) {
  localStorage.removeItem(itemKey);
}
