interface Size {
  col: number;
  row: number;
}

interface Position {
  x: number;
  y: number;
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
    this.instance = options.instance;
    this.size = options.size;
    this.board = board;
  }

  addElement(el: HTMLElement) {
    this.$el = el;
    this.$el.style.width = (100 / this.board.size.col) * this.size.col + "%";
    this.$el.style.height = (100 / this.board.size.row) * this.size.row + "%";
  }

  // events
  startMove(event: MouseEvent) {
    if (this.$el) {
      this.$el.style.zIndex = "71";

      this.calculateStart(event);

      if (this.pos) {
        this.board.changeTable(this.pos, this.size, null);
      }

      document.onmousemove = this.move.bind(this);
      document.onmouseup = this.endMove.bind(this);
    }
  }

  move(event: MouseEvent) {
    if (this.$el) {
      const delta = this.calculateDelta(event);
      const position = this.board.calculatePosition(event, this);

      if (position) {
        this.board.showPattern(this.size, position);
        this.pos = position;
      }

      this.$el.style.left = this.$el.offsetLeft + delta.x + "px";
      this.$el.style.top = this.$el.offsetTop + delta.y + "px";
    }
  }

  endMove(event: MouseEvent) {
    if (this.$el && this.pos) {
      this.board.hidePattern();
      this.stick();
      this.board.changeTable(this.pos, this.size, this.key);
      this.$el.style.zIndex = "70";
      this.mouse = undefined;
      document.onmousemove = null;
      document.onmouseup = null;
    }
  }

  // utils
  stick() {
    if (this.pos && this.$el) {
      this.$el.style.top = (100 / this.board.size.row) * this.pos.y + "%";
      this.$el.style.left = (100 / this.board.size.col) * this.pos.x + "%";
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

  constructor(tableSize: Size, root: HTMLElement, pattern: HTMLElement) {
    this.size = tableSize;
    this.table = createMatrix(tableSize, null);
    this.$root = root;
    this.$pattern = pattern;
    this.hidePattern();

    console.log(this);
  }

  addItem(instanceName: string, options: object, id: number = 0): BoardItem {
    const key = instanceName + id;
    if (this.items[key]) {
      return this.addItem(instanceName, options, id + 1);
    }
    const boardItem = new BoardItem(key, options, this);
    this.items[instanceName + id] = boardItem;

    setTimeout(() => {
      const selector = `[data-id="${key}"]`;
      const $el = this.$root.querySelector(selector) as HTMLElement;
      boardItem.addElement($el);
    }, 0);

    return boardItem;
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
    console.log(start.dx);
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

    return position;
  }
}

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
