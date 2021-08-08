export class WordsDictionaryCollection {

  private dictionaries: {[lang: string]: WordsDictionary} = {}


  public addDictionary(name: string, source: string): Promise<void> {

    this.dictionaries[name] = new WordsDictionary();
    return this.dictionaries[name].loadWords(source);

  }

  public getDictionary(name: string): WordsDictionary {
    return this.dictionaries[name];
  }
}

export class WordsDictionary {

  private words: Array<string> = [];
  private loaded = false;

  loadWords(source: string): Promise<void> {

    return fetch(`/words/${source}.txt`)
    .then(res => res.text())
    .then(res => {
      this.words = res.split(',');
      this.loaded = true;
      console.log(`[Words]\tLoaded ${this.words.length} words from ${source}.txt`)
    });

  }

  getWords(): Array<string> {
    return this.words;
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  // Find anagrams for current word
  findAnagrams(word: string, minLettersCount?: number) {

    const foundWords: Array<string> = [];
    const containedLetters: Array<string> = word.split('');

    mainLoop:
    for (let i = 0; i < this.words.length; i++) {

      // If the word length is longer than the current word
      // or the minimum required number of letters, skip this word
      if (minLettersCount && this.words[i].length < minLettersCount) continue;
      if (this.words[i].length > word.length) continue;

      const wordLetters: Array<string> = this.words[i].split('');

      // Check letters in selected word
      for (let j = 0; j < containedLetters.length; j++) {
        if (wordLetters.join('') != '') {
          const letterPos = wordLetters.indexOf(containedLetters[j]);

          wordLetters[letterPos] = '';
        }
      }

      // If the word still contains other letters, skip this word
      if (wordLetters.join('') != '') continue mainLoop;


      foundWords.push(this.words[i]);
    }

    return foundWords;

  }
}

const wordsDictionaryCollection = new WordsDictionaryCollection();
export default wordsDictionaryCollection;