import { LevelGenerator } from "@/utils/game/LevelGenerator";

const generator: LevelGenerator = new LevelGenerator();

const ctx: Worker = self as any;

ctx.onmessage = ev => {

  switch(ev.data.type) {

    case 'loadDictionary':
      generator.loadDictionary(ev.data.payload.name, ev.data.payload.source)
      .then(() => {
        self.postMessage({
          type: 'loadDictionaryDone',
          payload: {
            wordsCount: generator.curDict.getWords().length
          }
        })
      });
      break;

    case 'genLevel':
      self.postMessage({
        type: 'genLevelDone',
        payload: {
          level: generator.genLevel(ev.data.payload.level, ev.data.payload.settings)
        }
      });
      break;

  }


}