import Dictionary, { warning, Pair } from "./dictionary";

class DuplicatedDictionary extends Dictionary {
  constructor(pairs: Pair[]) {
    super(pairs, warning.duplicate);
  }

  markWarnings(): Map<string, warning> {
    const result = new Map();
    const dict: Map<string, Set<string>> = new Map();

    for (let pair of this.pairs) {
      let val = dict.get(pair.key);
      if (!val) {
        val = new Set();
        dict.set(pair.key, val);
      }
      if (val.has(pair.value)) {
        result.set(JSON.stringify(pair), this.watningLevel);
      }
      val.add(pair.value);
    }

    return result;
  }
}

export default DuplicatedDictionary;
