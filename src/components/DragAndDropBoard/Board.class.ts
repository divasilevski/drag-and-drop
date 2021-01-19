import { comparePositions, createMatrix } from "./board.helpers";
import { Size, BoardItems, BoardOptions, Position } from "./board.interfaces";
import { BoardItem } from "./BoardItem.class";

export class Board {
  public items: BoardItems<BoardItem> = {};
  public size: Size;
  public $root: HTMLElement;

  private $pattern: HTMLElement;
  private table: Array<Array<null | string>>; // null - если ячейка свободна, 'key' - ключ для заполненной ячейки
  private $panel: HTMLElement;
  private listeners: { [key: string]: Function[] };

  constructor(
    options: BoardOptions,
    root: HTMLElement,
    pattern: HTMLElement,
    panel: HTMLElement
  ) {
    this.size = options.size;
    this.table = createMatrix(this.size, null);
    this.$root = root;
    this.$pattern = pattern;
    this.$panel = panel;
    this.$pattern.style.position = "absolute";
    this.hidePattern();
    this.listeners = {};

    this.createItems(options.state);
  }

  // items
  addItem(
    instanceName: string,
    options: object,
    event: MouseEvent | null = null,
    id: number = 0
  ): BoardItem {
    const key = instanceName + id;
    if (this.items[key]) {
      return this.addItem(instanceName, options, event, id + 1);
    }
    const boardItem = new BoardItem(key, options, this);
    this.items[instanceName + id] = boardItem;

    setTimeout(() => {
      const selector = `[data-board-key="${key}"]`;
      const $el = this.$root.querySelector(selector) as HTMLElement;
      boardItem.addElement($el, event);
    }, 0);

    return boardItem;
  }

  createItems(state: any) {
    try {
      const keys = Object.keys(state);
      if (keys.length) {
        keys.forEach((key: string) => {
          const exec = /\d+$/.exec(key);
          if (!exec) return;
          const id = +exec[0];
          this.addItem(state[key].instance, state[key], null, id);
        });
      }
    } catch (e) {
      console.error("Failed to build the board from the passed data!");
    }
  }

  getItems() {
    const keys = Object.keys(this.items);
    const result: any = {};
    keys.forEach((key: string) => {
      result[key] = {
        instance: this.items[key].instance,
        size: this.items[key].size,
        pos: this.items[key].pos,
      };
    });
    return result;
  }

  removeItem(key: string) {
    this.emit("remove", key);
    delete this.items[key];
  }

  // $pattern
  showPattern(size: Size, position: Position) {
    this.$pattern.style.top = (100 / this.size.row) * position.y + "%";
    this.$pattern.style.left = (100 / this.size.col) * position.x + "%";
    this.$pattern.style.width = (100 / this.size.col) * size.col + "%";
    this.$pattern.style.height = (100 / this.size.row) * size.row + "%";
    this.$pattern.style.display = "block";
  }

  hidePattern() {
    this.$pattern.style.display = "none";
  }

  // table
  changeTable(position: Position, size: Size, value: null | string) {
    for (let i = 0; i < size.row; i++) {
      for (let j = 0; j < size.col; j++) {
        this.table[position.y + i][position.x + j] = value;
      }
    }
  }

  hasTableKeys(p: Position, size: Size): Boolean {
    for (let i = 0; i < size.row; i++) {
      for (let j = 0; j < size.col; j++) {
        if (this.table[p.y + i] === undefined) return true;
        if (this.table[p.y + i][p.x + j] === undefined) return true;
        if (this.table[p.y + i][p.x + j]) return true;
      }
    }
    return false;
  }

  // Calculation
  calculatePosition(e: MouseEvent, { pos, size, start }: BoardItem) {
    if (this.isBasket(e.pageX, e.pageY)) {
      return { x: NaN, y: NaN };
    }

    const rootRect = this.$root.getBoundingClientRect();
    let X = e.pageX - rootRect.left - start.dx;
    let Y = e.pageY - rootRect.top - start.dy;
    const W = rootRect.width;
    const H = rootRect.height;

    if (X < 0) X = 0;
    if (Y < 0) Y = 0;
    if (X > W) X = W - 1 - (W / this.size.col) * (size.col - 1);
    if (Y > H) Y = H - 1 - (H / this.size.row) * (size.row - 1);

    const position = {
      x: Math.floor((X / W) * this.size.col),
      y: Math.floor((Y / H) * this.size.row),
    };

    if (comparePositions(position, pos)) return null;
    if (this.hasTableKeys(position, size)) return null;

    this.showPattern(size, position);

    return position;
  }

  // panel
  isBasket(x: number, y: number): boolean {
    const panelRect = this.$panel.getBoundingClientRect();
    const rootRect = this.$root.getBoundingClientRect();
    if (
      x > panelRect.left &&
      y > panelRect.top &&
      x < panelRect.left + panelRect.width &&
      y < panelRect.top + panelRect.height
    ) {
      this.$pattern.style.display = "block";
      this.$pattern.style.width = panelRect.width + "px";
      this.$pattern.style.height = panelRect.height + "px";
      this.$pattern.style.top = panelRect.top - rootRect.top + "px";
      this.$pattern.style.left = panelRect.left - rootRect.left + "px";
      return true;
    }
    return false;
  }

  lock() {
    this.$panel.style.opacity = "0";
    this.$panel.style.pointerEvents = "none";
  }

  unlock() {
    this.$panel.style.opacity = "1";
    this.$panel.style.pointerEvents = "auto";
  }

  // Observer pattern
  subscribe(event: string, fn: Function) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(fn);
    return {
      unsubscribe: () => {
        this.listeners[event] = this.listeners[event].filter(
          (listener) => listener !== fn
        );
      },
    };
  }

  emit(event: string, ...args: any) {
    if (!Array.isArray(this.listeners[event])) {
      return false;
    }

    this.listeners[event].forEach((listener) => {
      listener(...args);
    });
    return true;
  }
}
