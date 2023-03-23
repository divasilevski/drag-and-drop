import type { Position, Size } from "./board.interfaces";

export function comparePositions(
  pos1: Position | null,
  pos2: Position | null
): boolean | null {
  return pos1 && pos2 && pos1.x === pos2.x && pos1.y === pos2.y;
}

export function createMatrix(size: Size, value: any): any[][] {
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

export function indexOfSmallest(a: number[]) {
  var lowest = 0;
  for (var i = 1; i < a.length; i++) {
    if (a[i] < a[lowest]) lowest = i;
  }
  return lowest;
}
