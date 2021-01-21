import { Board } from "./Board.class";
import { indexOfSmallest } from "./board.helpers";
import { BoardOptions, Position, Size } from "./board.interfaces";
import { BoardItem } from "./BoardItem.class";

export class PushingBoard extends Board {
  static pushing = {
    CHAOTIC: "chaotic",
    BACKFORWARD: "backforward",
    COMPLETELY: "completely",
  };

  private pushing: string = "none";
  private localTable: (string | null)[][] | null = null;
  private savedWidgets: any[] = [];

  constructor(
    options: BoardOptions,
    root: HTMLElement,
    pattern: HTMLElement,
    panel: HTMLElement
  ) {
    super(options, root, pattern, panel);

    this.subscribe("save", () => {
      // меняем глобально общий !!!!
      if (this.localTable) {
        this.table = this.localTable;
      }
      this.localTable = null;
    });
  }

  // owerride
  pushingStrategy(key: string, position: Position, size: Size) {
    if (this.hasTableKeys(position, size)) {
      // Заход на несвободное место!!!
      try {
        switch (this.pushing) {
          case PushingBoard.pushing.CHAOTIC:
            this.chaotic(key, position);
            break;
          case PushingBoard.pushing.BACKFORWARD:
            this.backforward(key, position);
            break;
          case PushingBoard.pushing.COMPLETELY:
            this.completely(key, position);
            break;
          default:
            return false;
        }
      } catch (e) {
        return false;
      }
    }
    return true;
  }

  // pushing
  pushingMode(mode: string) {
    if (PushingBoard.pushing.hasOwnProperty(mode.toUpperCase())) {
      this.pushing = mode;
    } else {
      this.pushing = "none";
    }
  }

  findPlace(item: BoardItem) {
    const places = [];
    for (let y = 0; y <= this.size.row - item.size.row; y++) {
      for (let x = 0; x <= this.size.col - item.size.col; x++) {
        if (!this.hasTableKeys({ x, y }, item.size)) places.push({ x, y });
      }
    }
    return places;
  }

  getSortedWidgets(current: BoardItem, pos: Position) {
    const keys: any = new Set();
    for (let i = 0; i < current.size.row; i++) {
      for (let j = 0; j < current.size.col; j++) {
        const key = this.table[i + pos.y][j + pos.x];
        if (key) keys.add(key);
      }
    }

    return [...keys]
      .map((key: string) => this.items[key])
      .sort((a, b) => b.size.row * b.size.col - a.size.row * a.size.col);
  }

  calcPlace(item: BoardItem, places: Position[]) {
    const distances = places.map((p: Position) => {
      const cPlace = [p.x + item.size.col / 2, p.y + item.size.row / 2];
      const cItem = [
        item.pos!.x + item.size.col / 2,
        item.pos!.y + item.size.row / 2,
      ];
      const d0 = cItem[0] - cPlace[0];
      const d1 = cItem[1] - cPlace[1];
      return Math.sqrt(d0 * d0 + d1 * d1);
    });

    return places[indexOfSmallest(distances)];
  }

  changeLocalTable(position: Position, size: Size, value: null | string) {
    for (let i = 0; i < size.row; i++) {
      for (let j = 0; j < size.col; j++) {
        this.localTable![position.y + i][position.x + j] = value;
      }
    }
  }

  hasLocalTableKeys(p: Position, size: Size): Boolean {
    for (let i = 0; i < size.row; i++) {
      for (let j = 0; j < size.col; j++) {
        if (this.localTable![p.y + i][p.x + j]) return true;
      }
    }
    return false;
  }

  // -------------------------------------------
  backforward(itemKey: string, pos: Position) {
    if (!this.localTable) {
      this.localTable = JSON.parse(JSON.stringify(this.table));
    }

    const current = this.items[itemKey];
    const widgets = this.getSortedWidgets(current, pos);

    console.table(this.savedWidgets);
    if (this.savedWidgets.length > 0) {
      this.savedWidgets.forEach(({ pos, item }) => {
        if (!widgets.map((widget: any) => widget.key).includes(item.key)) {
          console.log("Назад", item.key, pos);
          this.changeLocalTable(pos, item.size, item.key);
          item.shiftTo(pos);
        }
      });
      this.savedWidgets = this.savedWidgets.filter(({ item }) =>
        widgets.map((widget: any) => widget.key).includes(item.key)
      );
    }

    widgets.forEach((item: BoardItem) => {
      this.changeLocalTable(item.pos!, item.size, null);
    });
    this.changeLocalTable(pos, current.size, current.key);

    const forShift: any[] = [];
    widgets.forEach((item: BoardItem) => {
      // 5 Поиск свободных мест последовательно
      const places = [];
      for (let y = 0; y <= this.size.row - item.size.row; y++) {
        for (let x = 0; x <= this.size.col - item.size.col; x++) {
          if (!this.hasLocalTableKeys({ x, y }, item.size))
            places.push({ x, y });
        }
      }

      if (!places.length) {
        this.localTable = JSON.parse(JSON.stringify(this.table));
        console.warn("Нет места");
        throw new Error("Нет места");
      }

      const place = this.calcPlace(item, places);
      forShift.push({ item, place });

      const index = this.savedWidgets.findIndex(
        (el) => el.item.key === item.key
      );

      if (index !== -1) {
        this.savedWidgets.splice(index, 1);
      }
      this.savedWidgets.push({ item, pos: item.pos });

      this.changeLocalTable(place, item.size, item.key);
    });

    forShift.forEach(({ place, item }) => {
      item.shiftTo(place);
    });
    this.changeLocalTable(pos, current.size, null);
  }

  // -------------------------------------------

  chaotic(itemKey: string, pos: Position) {
    const table = JSON.parse(JSON.stringify(this.table));
    const current = this.items[itemKey];
    const widgets = this.getSortedWidgets(current, pos);

    widgets.forEach((item: BoardItem) => {
      this.changeTable(item.pos!, item.size, null);
    });
    this.changeTable(pos, current.size, current.key);

    const forShift: any[] = [];
    widgets.forEach((item: BoardItem) => {
      // 5 Поиск свободных мест последовательно
      const places = this.findPlace(item);

      if (!places.length) {
        this.table = table;
        console.warn("Нет места");
        throw new Error("Нет места");
      }

      const place = this.calcPlace(item, places);
      forShift.push({ item, place });
      this.changeTable(place, item.size, item.key);
    });

    forShift.forEach(({ place, item }) => {
      item.shiftTo(place);
    });
    this.changeTable(pos, current.size, null);
  }

  // -------------------------------------------

  completely(itemKey: string, pos: Position) {}
}
