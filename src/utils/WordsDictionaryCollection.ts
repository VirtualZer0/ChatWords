export class WordsDictionaryCollection {

  private dictionaries: {[lang: string]: WordsDictionary} = {};


  public addDictionary(name: string, source: string): Promise<void> {

    this.dictionaries[name] = new WordsDictionary();
    return this.dictionaries[name].loadWords(source);

  }

  public getDictionary(name: string): WordsDictionary {
    return this.dictionaries[name];
  }
}

export class WordsDictionary {

  private words: string[] = [];
  private letters: string[] = [];
  private loaded = false;

  public w4candidates: string[] = [];
  public w5candidates: string[] = [];
  public w6candidates: string[] = [];
  public w7candidates: string[] = [];

  loadWords(source: string): Promise<void> {

    return Promise.all([

      fetch(`/words/${source}/all.txt`)
        .then(res => res.text())
        .then(res => {
          this.words = res.split(',');
          console.log(`[Words]\tLoaded ${this.words.length} words from ${source}/all.txt`);
        }),

      fetch(`/words/${source}/w4candidates.txt`)
        .then(res => res.text())
        .then(res => {
          this.w4candidates = res.split(',');
          console.log(`[Words]\tLoaded ${this.w4candidates.length} w4candidates from ${source}/w4candidates.txt`);
        }),

      fetch(`/words/${source}/w5candidates.txt`)
        .then(res => res.text())
        .then(res => {
          this.w5candidates = res.split(',');
          console.log(`[Words]\tLoaded ${this.w5candidates.length} w5candidates from ${source}/w5candidates.txt`);
        }),

      fetch(`/words/${source}/w6candidates.txt`)
        .then(res => res.text())
        .then(res => {
          this.w6candidates = res.split(',');
          console.log(`[Words]\tLoaded ${this.w6candidates.length} w6candidates from ${source}/w6candidates.txt`);
        }),

      fetch(`/words/${source}/w7candidates.txt`)
        .then(res => res.text())
        .then(res => {
          this.w7candidates = res.split(',');
          console.log(`[Words]\tLoaded ${this.w7candidates.length} w7candidates from ${source}/w7candidates.txt`);
        }),

      fetch(`/words/${source}/letters.txt`)
        .then(res => res.text())
        .then(res => {
          this.letters = res.split(',');
          console.log(`[Words]\tLoaded ${this.letters.length} letters from ${source}/letters.txt`);
        }),

    ])
    .then (() => {
      this.loaded = true;
    })

  }

  getWords(): string[] {
    return this.words;
  }

  getLetters(): string[] {
    return this.letters;
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  // Find anagrams for current word
  findAnagrams(word: string, minLettersCount?: number): string[] {

    const foundWords: string[] = [];
    const containedLetters: string[] = word.split('');

    for (let i = 0; i < this.words.length; i++) {

      // If the word length is longer than the current word
      // or the minimum required number of letters, skip this word
      if (minLettersCount && this.words[i].length < minLettersCount) continue;
      if (this.words[i].length > word.length) continue;

      const wordLetters: string[] = this.words[i].split('');

      // Check letters in selected word
      let wordLength = wordLetters.length;

      for (let j = 0; j < containedLetters.length; j++) {
        const letterPos = wordLetters.indexOf(containedLetters[j]);

        if (letterPos > -1) {
          wordLetters[letterPos] = "";
          wordLength --;
        }
      }

      // If the word still contains other letters, skip this word
      if (wordLength > 0) continue;


      foundWords.push(this.words[i]);
    }

    return foundWords;

  }
}

const wordsDictionaryCollection = new WordsDictionaryCollection();
export default wordsDictionaryCollection;