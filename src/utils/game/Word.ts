export default class Word {

  word = '';
  uncovered = false;
  failed = false;
  player = '';
  points = 0;

  constructor(init?: Partial<Word>) {
    Object.assign(this, init);
  }

}