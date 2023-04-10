export const RawDifficulty = {
  easy: "1",
  normal: "2",
  hard: "3",
  evil: "4",
} as const
export const Difficulty = {
  ...RawDifficulty,
  1: "easy",
  2: "normal",
  3: "hard",
  4: "evil",
} as const
export const baseUrl = "https://four.websudoku.com"
// https://four.websudoku.com/?level=3&set_id=1
export const folderGrab = "tmp-raw";
export const folderUsed = "tmp-junk";