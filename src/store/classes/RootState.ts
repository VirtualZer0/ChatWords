import Letter from "@/utils/game/Letter";
import Level from "@/utils/game/Level";
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

  lvlData: Level;
  lvlNumber: number;
  lvlGenerated: boolean;
  players: Player[];
  time: number;

}