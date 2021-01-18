import { BoardItem } from "./BoardItem.class";

export interface Size {
  col: number;
  row: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface BoardOptions {
  size: Size;
  state: BoardItems<BoardItem>;
}

export interface BoardItems<T> {
  [key: string]: T;
}
