export type Mark = "X" | "O";
export type Cell = Mark | null;

export const LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

export type Result =
  | { kind: "win"; winner: Mark; line: readonly number[] }
  | { kind: "draw" }
  | null;

export function getResult(board: Cell[]): Result {
  for (const [a, b, c] of LINES) {
    const m = board[a];
    if (m && m === board[b] && m === board[c]) {
      return { kind: "win", winner: m, line: [a, b, c] };
    }
  }
  return board.every(Boolean) ? { kind: "draw" } : null;
}
