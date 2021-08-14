import { WordsDictionary, WordsDictionaryCollection } from "../WordsDictionaryCollection";
import Letter from "./Letter";
import Level from "./Level";
import Word from "./Word";

/*eslint-disable no-constant-condition*/

export class LevelGenerator {

  dicts: WordsDictionaryCollection = new WordsDictionaryCollection();
  curDict: WordsDictionary = new WordsDictionary();

  loadDictionary(name: string, source: string): Promise<void> {

    return this.dicts.addDictionary(name, source)
    .then(() => {
      this.curDict = this.dicts.getDictionary(name);
    });

  }

  getDictionaryWordsCount(name: string) {
    return this.curDict.getWords().length;
  }

  genLevel(lvlNumber: number, settings: {
    useFakeLetters: boolean;
    useHiddenLetters: boolean;
  }): Level {

    const allWords: string[] = this.curDict.getWords();

    let candidates: string[];
    const anagramsLength = Math.floor(lvlNumber/20)+4;

    // Select cndidates dictionary
    if (lvlNumber < 20)
      candidates = this.curDict.w4candidates;
    else if (lvlNumber < 40)
      candidates = this.curDict.w5candidates;
    else if (lvlNumber < 60)
      candidates = this.curDict.w6candidates;
    else
      candidates = this.curDict.w7candidates;

    // Select word
    const randPos = Math.floor(Math.random()*candidates.length);
    const word = candidates.splice(randPos)[0];
    const anagrams = this.curDict
      .findAnagrams(word, anagramsLength)
      .sort((a, b) => b.length - a.length)
      .map(anagram => new Word({
        word: anagram
      }));

    const letters = word.split('').map(letter => new Letter({letter}));
    const letterPoints: {[key: string]: number} = {};

    // Add hidden letters
    if (lvlNumber > 14 && settings.useHiddenLetters) {
      letters[Math.floor(Math.random() * letters.length)].hidden = true;
    }

    if (lvlNumber > 34 && settings.useHiddenLetters) {
      const unhiddenLetters = letters.filter(letter => !letter.hidden);
      unhiddenLetters[Math.floor(Math.random() * unhiddenLetters.length)].hidden = true;
    }

    // Add fake letters
    if (lvlNumber > 7 && settings.useFakeLetters) {
      letters.push(new Letter({
        fake: true,
        letter: this.curDict.getLetters()[Math.floor(Math.random() * this.curDict.getLetters().length)]
      }))
    }

    if (lvlNumber > 27 && settings.useFakeLetters) {
      letters.push(new Letter({
        fake: true,
        letter: this.curDict.getLetters()[Math.floor(Math.random() * this.curDict.getLetters().length)]
      }));
    }

    // Calculate letter points
    anagrams.forEach(anagram => {
      anagram.word.split('').forEach(anagramLetter => {
        if (!letterPoints[anagramLetter])
          letterPoints[anagramLetter] = 0;

        letterPoints[anagramLetter]++;
      });
    });

    for (const [key, value] of Object.entries(letterPoints)) {

      let newCost = 1;

      if (value <= anagrams.length) {
        newCost = Math.round((anagrams.length - value)/2);
      }

      letters.forEach(letter => {
        if (letter.letter == key) {
          letter.points = newCost;
        }
      });
    }

    // Set words points
    let maxPoints = 0

    anagrams.forEach(anagram => {
      anagram.word.split('').forEach(letter => {
        const foundLetter = letters.find(fLetter => fLetter.letter == letter);
        anagram.points += foundLetter?.points ?? 0;
      })

      maxPoints += anagram.points;
    });

    // Set random points for fake unscored letters
    letters.forEach(letter => {
      if (letter.points == 0) {
        letter.points = Math.floor(Math.random() * 10) + 1;
      }
    });

    // Ыet letters id

    for (let i = 0; i < letters.length; i++) {
      letters[i].id = i+1;
    }

    return new Level({
      letters,
      words: anagrams,
      maxPoints,
      donePoints: Math.round(maxPoints*.6)
    });

  }

}