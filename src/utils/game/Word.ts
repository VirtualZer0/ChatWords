export default class Word {

  word: string = '';
  opened: boolean = false;
  player: string = '';

  constructor(init?: Partial<Word>) {
    Object.assign(this, init);
  }

}