import { RawDifficulty } from '~/utils/constant';
export type ValueOf<T> = T[keyof T];
export type IRawDifficulty= ValueOf<typeof RawDifficulty>