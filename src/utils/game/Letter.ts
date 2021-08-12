export default class Letter {

  letter = '';
  points = 0;
  fake = false;
  hidden = false;
  uncovered = false;

  constructor (init?: Partial<Letter>) {
    Object.assign(this, init);
  }

}