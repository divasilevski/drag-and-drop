interface Size {
  col: number;
  row: number;
}

interface Position {
  x: number;
  y: number;
}

export interface BoardOptions {
  size: Size;
  state: BoardItems<BoardItem>;
}

interface BoardItems<T> {
  [key: string]: T;
}

// ----------------------------------

export class BoardItem {
  public instance: string;
  public size: Size;
  public pos: null | Position = null;
  public start: { dx: number; dy: number } = { dx: 0, dy: 0 };

  private key: string;
  private board: Board;
  private $el?: HTMLElement;
  private mouse?: Position;

  // init methods
  constructor(key: string, options: any, board: Board) {
    this.key = key;
    this.pos = options.pos || null;
    this.instance = options.instance;
    this.size = options.size;
    this.board = board;
  }

  addElement(el: HTMLElement, event: MouseEvent | null) {
    this.$el = el;
    const $root = this.board.$root;
    el.style.width = (100 / this.board.size.col) * this.size.col + "%";
    el.style.height = (100 / this.board.size.row) * this.size.row + "%";

    const hWidth = el.offsetWidth / 2;
    const hHeight = el.offsetHeight / 2;

    if (event) {
      el.style.left = event.pageX - $root.offsetLeft - hWidth + "px";
      el.style.top = event.pageY - $root.offsetTop - hHeight + "px";
    } else {
      this.stick();
    }

    el.style.opacity = "1";
  }

  // events
  startMove(event: MouseEvent) {
    setTimeout(() => {
      if (this.$el) {
        this.$el.style.zIndex = "71";

        this.calculateStart(event);

        if (this.pos) {
          this.board.changeTable(this.pos, this.size, null);
          this.pos = null;
          this.move(event);
        }

        document.onmousemove = this.move.bind(this);
        document.onmouseup = this.endMove.bind(this);
      }
    });
  }

  move(event: MouseEvent) {
    if (this.$el) {
      const delta = this.calculateDelta(event);
      const position = this.board.calculatePosition(event, this);

      if (position) this.pos = position;

      this.$el.style.left = this.$el.offsetLeft + delta.x + "px";
      this.$el.style.top = this.$el.offsetTop + delta.y + "px";
    }
  }

  endMove(event: MouseEvent) {
    if (this.$el && this.pos && !isNaN(this.pos.x)) {
      this.stick();
      this.$el.style.zIndex = "70";
      this.mouse = undefined;
    } else {
      this.board.removeItem(this.key);
    }
    this.board.hidePattern();
    document.onmousemove = null;
    document.onmouseup = null;

    this.board.emit("change", this.board.getItems());
  }

  // utils
  stick() {
    if (this.pos && this.$el) {
      this.$el.style.top = (100 / this.board.size.row) * this.pos.y + "%";
      this.$el.style.left = (100 / this.board.size.col) * this.pos.x + "%";
      this.board.changeTable(this.pos, this.size, this.key);
    }
  }

  calculateDelta(event: MouseEvent): Position {
    const x = this.mouse ? event.pageX - this.mouse.x : 0;
    const y = this.mouse ? event.pageY - this.mouse.y : 0;
    this.mouse = { x: event.pageX, y: event.pageY };
    return { x, y };
  }

  calculateStart(e: MouseEvent) {
    if (this.$el) {
      const $root = this.board.$root;
      const hWidth = $root.offsetWidth / this.board.size.col / 2;
      const hHeight = $root.offsetHeight / this.board.size.row / 2;
      const dx = e.pageX - this.$el.offsetLeft - $root.offsetLeft - hWidth;
      const dy = e.pageY - this.$el.offsetTop - $root.offsetTop - hHeight;
      this.start = { dx, dy };
    }
  }
}

// ----------------------------------

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
      const selector = `[data-id="${key}"]`;
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
          this.addItem(state[key].instance, state[key]);
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

    let X = e.pageX - this.$root.offsetLeft - start.dx;
    let Y = e.pageY - this.$root.offsetTop - start.dy;
    const W = this.$root.offsetWidth;
    const H = this.$root.offsetHeight;

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
    const p = this.$panel;
    if (
      x > p.offsetLeft &&
      y > p.offsetTop &&
      x < p.offsetLeft + p.offsetWidth &&
      y < p.offsetTop + p.offsetHeight
    ) {
      this.$pattern.style.display = "block";
      this.$pattern.style.width = p.offsetWidth + "px";
      this.$pattern.style.height = p.offsetHeight + "px";
      this.$pattern.style.top = p.offsetTop - this.$root.offsetTop + "px";
      this.$pattern.style.left = p.offsetLeft - this.$root.offsetLeft + "px";
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

// ------------------------------------

function comparePositions(
  pos1: Position | null,
  pos2: Position | null
): boolean | null {
  return pos1 && pos2 && pos1.x === pos2.x && pos1.y === pos2.y;
}

function createMatrix(size: Size, value: any): any[][] {
  const matrix = [];
  for (let i = 0; i < size.row; i++) {
    const row = [];
    for (let j = 0; j < size.col; j++) {
      row.push(value);
    }
    matrix.push(row);
  }
  return matrix;
}
