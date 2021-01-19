export function getCurrentDate() {
  return new Date().toLocaleTimeString("ru-RU", { hour12: false });
}

export function randInt(a: number, b: number): number {
  let rand: number = a - 0.5 + Math.random() * (b - a + 1);
  return Math.round(rand);
}
