export enum warning {
  none = 0,
  duplicate = 1,
  fork = 2,
  chain = 3,
  loop = 4
}

export type Pair = { key: string; value: string };

abstract class Dictionary {
  protected dictionary: Map<string, Set<string>> = new Map();

  constructor(protected pairs: Pair[], protected watningLevel: warning) {
    this.buildDictionary();
  }
  private buildDictionary() {
    for (let pair of this.pairs) {
      let val = this.dictionary.get(pair.key);
      if (!val) {
        val = new Set();
        this.dictionary.set(pair.key, val);
      }
      val.add(pair.value);
    }
  }

  abstract markWarnings(): Map<string, warning>;
}

export default Dictionary;
