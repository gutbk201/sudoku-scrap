import { SudokuRawDifficulty, KillerDifficulty } from "~/utils/constant";
export type ValueOf<T> = T[keyof T];
export type IRawSudokuDifficulty = ValueOf<typeof SudokuRawDifficulty>;
export type IRawKillerDifficulty = ValueOf<typeof KillerDifficulty>;
