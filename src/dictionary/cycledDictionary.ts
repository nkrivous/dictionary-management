import Dictionary, { warning, Pair } from "./dictionary";

enum color {
  white,
  gray,
  black
}

class CycledDictionary extends Dictionary {
  constructor(pairs: Pair[]) {
    super(pairs, warning.chain);
  }

  private findLoop(
    v: string,
    colors: Map<string, color>,
    stack: string[],
    result: string[][]
  ): any {
    if (colors.get(v) === color.black) {
      return;
    }

    if (colors.get(v) === color.gray) {
      const idx = stack.indexOf(v);
      result.push(stack.slice(idx));
      return;
    }

    colors.set(v, color.gray);
    stack.push(v);

    const children = this.dictionary.get(v);
    if (children) {
      for (let child of children) {
        this.findLoop(child, colors, stack, result);
      }
    }
    stack.pop();

    colors.set(v, color.black);
  }

  markWarnings(): Map<string, warning> {
    const result: Map<string, warning> = new Map();
    const colors: Map<string, color> = new Map();

    for (let v of this.dictionary.keys()) {
      for (let v of this.dictionary.keys()) {
        colors.set(v, color.white);
      }

      const stack: string[] = [];
      let loops: string[][] = [];
      this.findLoop(v, colors, stack, loops);
      loops.forEach(x => {
        for (let i = 1; i < x.length; i++) {
          result.set(
            JSON.stringify({ key: x[i - 1], value: x[i] }),
            this.watningLevel
          );
        }
        result.set(
          JSON.stringify({ key: x[x.length - 1], value: x[0] }),
          this.watningLevel
        );
      });
    }
    return result;
  }
}

export default CycledDictionary;
