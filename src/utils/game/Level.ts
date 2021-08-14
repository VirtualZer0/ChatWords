import Letter from "./Letter";
import Word from "./Word";

export default class Level {

  letters: Letter[] = [];
  words: Word[] = [];

  points = 0;
  maxPoints = 0;
  donePoints = 0;

  constructor(val: Partial<Level>) {
    Object.assign(this, val);
  }

}