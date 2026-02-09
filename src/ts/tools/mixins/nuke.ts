// A mixin method to completely nuke a class or object, it walks the whole tree nullifying everything
export function nuke(target: any): void {
  let proto = target;
  while (proto && proto !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key === "constructor") continue;
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if ("function" === typeof desc?.value) continue;
      if (desc?.get || desc?.set) continue;
      proto[key] = null; // See ya!, it's armageddon baby!
    }
    proto = Object.getPrototypeOf(proto);
  }
}
