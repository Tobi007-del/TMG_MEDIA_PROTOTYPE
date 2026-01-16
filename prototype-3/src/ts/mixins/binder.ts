export default function bindMethods(
  owner: any,
  callback = (method: string, owner: any) => {
    owner[method] = owner[method].bind(owner);
  }
): void {
  let proto = owner;
  while (proto && proto !== Object.prototype) {
    for (const method of Object.getOwnPropertyNames(proto)) {
      if (method === "constructor") continue;
      if ("function" !== typeof Object.getOwnPropertyDescriptor(proto, method)?.value) continue;
      callback(method, owner);
    }
    proto = Object.getPrototypeOf(proto);
  }
}
