import Dictionary, { warning, Pair } from "./dictionary";

class ForkedDictionary extends Dictionary {
  constructor(pairs: Pair[]) {
    super(pairs, warning.fork);
  }
  markWarnings(): Map<string, warning> {
    const result = new Map();
    for (let [key, value] of this.dictionary) {
      if (value.size > 1) {
        for (let v of value.keys()) {
          result.set(JSON.stringify({ key, value: v }), this.watningLevel);
        }
      }
    }

    return result;
  }
}

export default ForkedDictionary;
