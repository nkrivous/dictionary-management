import Dictionary, { warning, Pair } from "./dictionary";

class ChainedDictionary extends Dictionary {
  constructor(pairs: Pair[]) {
    super(pairs, warning.chain);
  }
  markWarnings(): Map<string, warning> {
    const result = new Map();
    for (let pair of this.pairs) {
      if (this.dictionary.get(pair.value) !== undefined) {
        result.set(JSON.stringify(pair), this.watningLevel);
        for (let v of this.dictionary.get(pair.value)!) {
          result.set(
            JSON.stringify({ key: pair.value, value: v }),
            this.watningLevel
          );
        }
      }
    }
    return result;
  }
}

export default ChainedDictionary;
