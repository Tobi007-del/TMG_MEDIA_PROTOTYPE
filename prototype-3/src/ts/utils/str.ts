export function capitalize(word = ""): string {
  return word.replace(/^(\s*)([a-z])/i, (_, s, l) => s + l.toUpperCase());
}

export function camelize(str = "", { source } = /[\s_-]+/, { preserveInnerCase: pIC = true, upperFirst: uF = false } = {}): string {
  return (pIC ? str : str.toLowerCase()).replace(new RegExp(`${source}(\\w)`, "g"), (_, c) => c.toUpperCase()).replace(/^\w/, (c) => c[uF ? "toUpperCase" : "toLowerCase"]());
}

export function uncamelize(str = "", separator = " "): string {
  return str.replace(/([a-z])([A-Z])/g, `$1${separator}$2`).toLowerCase();
}