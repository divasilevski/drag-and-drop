import { Board } from "./Board.class";
import { Position, Size } from "./board.interfaces";

export class BoardItem {
  public instance: string;
  public slot: any;
  public size: Size;
  public pos: null | Position = null;
  public start: { dx: number; dy: number } = { dx: 0, dy: 0 };
  public key: string;

  private board: Board;
  private $el?: HTMLElement;
  private mouse?: Position;

  // init methods
  constructor(key: string, options: any, board: Board) {
    this.key = key;
    this.pos = options.pos || null;
    this.instance = options.instance;
    this.slot = options.slot;
    this.size = options.size;
    this.board = board;
  }

  addElement(el: HTMLElement, event: MouseEvent | null) {
    this.$el = el;
    const rootRect = this.board.$root.getBoundingClientRect();
    el.style.width = (100 / this.board.size.col) * this.size.col + "%";
    el.style.height = (100 / this.board.size.row) * this.size.row + "%";

    const hWidth = el.offsetWidth / 2;
    const hHeight = el.offsetHeight / 2;

    if (event) {
      el.style.left = event.pageX - rootRect.left - hWidth + "px";
      el.style.top = event.pageY - rootRect.top - hHeight + "px";
    } else {
      this.stick();
    }

    el.style.opacity = "1";
  }

  // events
  startMove(event: MouseEvent) {
    event.preventDefault();
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
    event.preventDefault();
    if (this.$el) {
      const delta = this.calculateDelta(event);
      const position = this.board.calculatePosition(event, this);

      if (position) this.pos = position;

      this.$el.style.left = this.$el.offsetLeft + delta.x + "px";
      this.$el.style.top = this.$el.offsetTop + delta.y + "px";
    }
  }

  endMove(event: MouseEvent) {
    event.preventDefault();
    if (this.$el && this.pos && !isNaN(this.pos.x)) {
      // this.stick();
      this.shiftTo(this.pos);
      this.mouse = undefined;
    } else {
      this.board.removeItem(this.key);
    }
    this.board.hidePattern();
    document.onmousemove = null;
    document.onmouseup = null;

    this.board.emit("save", this.board.getItems());
  }

  shiftTo(pos: Position) {
    if (this.$el) {
      this.$el.style.transition = "0.2s";
      this.pos = pos;
      this.stick();
      setTimeout(() => {
        if (this.$el) {
          this.$el.style.transition = "none";
          this.$el.style.zIndex = "70";
        }
      }, 200);
    }
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
      const rootRect = this.board.$root.getBoundingClientRect();
      const hWidth = rootRect.width / this.board.size.col / 2;
      const hHeight = rootRect.height / this.board.size.row / 2;
      const dx = e.pageX - this.$el.offsetLeft - rootRect.left - hWidth;
      const dy = e.pageY - this.$el.offsetTop - rootRect.top - hHeight;
      this.start = { dx, dy };
    }
  }
}
