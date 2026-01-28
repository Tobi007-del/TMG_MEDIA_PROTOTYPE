import type { TechConstructor } from "../media";
import { PlugConstructor } from "../plugs";

export interface RegistryItem<T> {
  name: string;
  value: T;
  options?: any; // no closed doors
}

export class BaseRegistry<T> {
  protected items: RegistryItem<T>[] = [];

  public register(name: string, value: T, options?: any) {
    this.unregister(name); // Safety replacement
    return (this.items.push({ name, value, options }), this);
  }

  public unregister(name: string) {
    return ((this.items = this.items.filter((i) => i.name !== name)), this);
  }

  public get(name: string): T | undefined {
    return this.items.find((i) => i.name === name)?.value;
  }

  public getAll(): T[] {
    return this.items.map((i) => i.value);
  }
}

export class OrderedRegistry<T> extends BaseRegistry<T> {
  public registerPriority(name: string, value: T, options?: any) {
    this.unregister(name);
    return (this.items.unshift({ name, value, options }), this);
  }

  public registerBefore(key: string, name: string, value: T, options?: any) {
    const idx = this.items.findIndex((i) => i.name === key);
    if (idx === -1) return (console.warn(`[TMG Registry] Cannot register '${name}' before '${key}': Target '${key}' not found.`), this);
    this.unregister(name);
    return (this.items.splice(idx, 0, { name, value, options }), this);
  }

  public registerAfter(key: string, name: string, value: T, options?: any) {
    const idx = this.items.findIndex((i) => i.name === key);
    if (idx === -1) return (console.warn(`[TMG Registry] Cannot register '${name}' after '${key}': Target '${key}' not found.`), this);
    this.unregister(name);
    return (this.items.splice(idx + 1, 0, { name, value, options }), this);
  }
}

export class TechRegistry extends OrderedRegistry<TechConstructor> {
  private static instance = new TechRegistry();

  static get(name: string) {
    return this.instance.get(name);
  }
  static register(name: string, Tech: TechConstructor) {
    this.instance.register(name, Tech);
  }
  static unregister(name: string) {
    this.instance.unregister(name);
  }

  static registerBefore(key: string, name: string, Tech: TechConstructor) {
    this.instance.registerBefore(key, name, Tech);
  }
  static registerAfter(key: string, name: string, Tech: TechConstructor) {
    this.instance.registerAfter(key, name, Tech);
  }

  static pick(src: string): TechConstructor | null {
    return this.instance.getAll().find((T) => T.canPlaySource(src)) || null;
  }
}

export class PlugRegistry extends OrderedRegistry<PlugConstructor> {
  private static instance = new PlugRegistry();

  static get(name: string) {
    return this.instance.get(name);
  }
  static register(Plug: PlugConstructor, opts?: any) {
    this.instance.register(Plug.plugName, Plug, opts);
  }
  static unregister(name: string) {
    this.instance.unregister(name);
  }

  static registerBefore(key: string, Plug: PlugConstructor) {
    this.instance.registerBefore(key, Plug.plugName, Plug);
  }
  static registerAfter(key: string, Plug: PlugConstructor) {
    this.instance.registerAfter(key, Plug.plugName, Plug);
  }

  static getOrdered(): PlugConstructor[] {
    return this.instance.getAll();
  }
}
