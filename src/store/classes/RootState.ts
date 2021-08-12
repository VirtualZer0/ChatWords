import Letter from "@/utils/game/Letter";
import Player from "@/utils/game/Player";
import Word from "@/utils/game/Word";

export interface RootState {

  currentWordsCount: number;
  bestLevel: number;
  channel: string;

  useFakeLetters: boolean;
  useHiddenLetters: boolean;
  useHiddenWords: boolean;

  gameState: RootStorageGameState;

}

export interface RootStorageGameState {

  letters: Array<Letter>;
  words: Array<Word>;
  players: Array<Player>;

  level: number;
  points: number;
  maxPoints: number;
  donePoints: number;

  time: number;

}