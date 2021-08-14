export default class Letter {

  letter = '';
  points = 0;
  fake = false;
  hidden = false;
  uncovered = false;
  id = 0;

  constructor (init?: Partial<Letter>) {
    Object.assign(this, init);
  }

}