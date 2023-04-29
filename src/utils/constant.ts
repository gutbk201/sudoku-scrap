export const SudokuRawDifficulty = {
  easy: "1",
  normal: "2",
  hard: "3",
  evil: "4",
} as const
export const SudokuDifficulty = {
  ...SudokuRawDifficulty,
  1: "easy",
  2: "normal",
  3: "hard",
  4: "evil",
} as const
export const KillerDifficulty = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
} as const
export const sudokuBaseUrl = "https://four.websudoku.com"
export const killerBaseUrl = "https://www.dailykillersudoku.com"
// https://www.dailykillersudoku.com/search?d=3&t=2
export const folderGrab = "tmp-raw";
export const folderUsed = "tmp-junk";