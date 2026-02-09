// A mixin method expert often used to bind all methods of a class to an instance
export function onAllMethods(owner: any, callback: (method: string, owner: any) => void): void {
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

export function bindAllMethods(owner: any): void {
  onAllMethods(owner, (method: string, owner: any) => {
    owner[method] = owner[method].bind(owner);
  });
}

export function guardAllMethods(owner: any, guardFn: (fn: Function) => Function = guardMethod, bound = true): void {
  onAllMethods(owner, (method: string, owner: any) => {
    owner[method] = guardFn(bound ? owner[method].bind(owner) : owner[method]);
  });
}

export function guardMethod<T extends Function>(fn: T, onError: (e: any) => void = (e) => console.error(e)): T {
  return ((...args: any[]) => {
    try {
      const result = fn(...args);
      return result instanceof Promise ? result.catch((e) => onError(e)) : result;
    } catch (e) {
      onError(e);
    }
  }) as unknown as T;
}
