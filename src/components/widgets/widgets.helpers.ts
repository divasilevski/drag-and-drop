export function getCurrentDate() {
  return new Date().toLocaleTimeString("ru-RU", { hour12: false });
}
