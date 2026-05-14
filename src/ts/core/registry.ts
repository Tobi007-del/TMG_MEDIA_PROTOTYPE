import type { BaseTech, TechConstructor } from "../techs";
import type { BasePlug, PlugConstructor } from "../plugs";
import type { BaseComponent, ComponentConstructor } from "../components";
import { CONFIG_BUILD } from "../consts";

export interface RegistryItem<T> {
  name: string;
  value: T;
  config?: any; // no closed doors
}

export class BaseRegistry<T> {
  protected items: RegistryItem<T>[] = [];

  public register(name: string, value: T, config?: any): this {
    this.unregister(name); // Safety replacement
    return this.items.push({ name, value, config }), this;
  }

  public unregister(name: string) {
    return (this.items = this.items.filter((i) => i.name !== name)), this;
  }

  public get(name: string): T | undefined {
    return this.items.find((i) => i.name === name)?.value;
  }

  public getAll(order?: string[]): T[] {
    if (!order) return this.items.map((i) => i.value);
    return this.items
      .sort((a, b) => {
        const aIdx = order.indexOf(a.name),
          bIdx = order.indexOf(b.name);
        return aIdx === -1 && bIdx === -1 ? 0 : aIdx === -1 ? 1 : bIdx === -1 ? -1 : aIdx - bIdx;
      })
      .map((i) => i.value);
  }
}

export class OrderedRegistry<T> extends BaseRegistry<T> {
  public registerPriority(name: string, value: T, config?: any) {
    this.unregister(name);
    return this.items.unshift({ name, value, config }), this;
  }

  public registerBefore(key: string, name: string, value: T, config?: any) {
    const idx = this.items.findIndex((i) => i.name === key);
    if (idx === -1) return console.warn(`[TMG Registry] Cannot register '${name}' before '${key}': Target '${key}' not found.`), this;
    this.unregister(name);
    return this.items.splice(idx, 0, { name, value, config }), this;
  }

  public registerAfter(key: string, name: string, value: T, config?: any) {
    const idx = this.items.findIndex((i) => i.name === key);
    if (idx === -1) return console.warn(`[TMG Registry] Cannot register '${name}' after '${key}': Target '${key}' not found.`), this;
    this.unregister(name);
    return this.items.splice(idx + 1, 0, { name, value, config }), this;
  }
}

export class TechRegistry extends OrderedRegistry<TechConstructor> {
  private static instance = new TechRegistry();

  static get<T extends BaseTech = BaseTech>(name: string) {
    return this.instance.get(name) as TechConstructor<T> | undefined;
  }
  static register(Tech: TechConstructor): void {
    this.instance.register(Tech.techName, Tech);
  }
  static unregister(name: string): void {
    this.instance.unregister(name);
  }
  static registerBefore(key: string, Tech: TechConstructor): void {
    this.instance.registerBefore(key, Tech.techName, Tech);
  }
  static registerAfter(key: string, Tech: TechConstructor): void {
    this.instance.registerAfter(key, Tech.techName, Tech);
  }
  static pick(src: string, techOrder?: string[]): TechConstructor | null {
    return this.instance.getAll(techOrder).find((T) => T.canPlaySource(src)) || null;
  }
}

export class PlugRegistry extends OrderedRegistry<PlugConstructor> {
  private static instance = new PlugRegistry();

  static get<T extends BasePlug = BasePlug>(name: string) {
    return this.instance.get(name) as PlugConstructor<T> | undefined;
  }
  static register(Plug: PlugConstructor, opts?: any): void {
    this.instance.register(Plug.plugName, Plug, opts);
    (CONFIG_BUILD as any)[Plug.plugName] = Plug.BUILD;
  }
  static unregister(name: string): void {
    this.instance.unregister(name);
    delete (CONFIG_BUILD as any)[name];
  }
  static registerBefore(key: string, Plug: PlugConstructor): void {
    this.instance.registerBefore(key, Plug.plugName, Plug);
  }
  static registerAfter(key: string, Plug: PlugConstructor): void {
    this.instance.registerAfter(key, Plug.plugName, Plug);
  }
  static getOrdered(): PlugConstructor[] {
    return this.instance.getAll();
  }
}

export class ComponentRegistry extends BaseRegistry<ComponentConstructor> {
  private static instance = new ComponentRegistry();

  static get<T extends BaseComponent = BaseComponent>(name: string) {
    return this.instance.get(name) as ComponentConstructor<T> | undefined;
  }
  static register(Comp: ComponentConstructor): void {
    this.instance.register(Comp.componentName, Comp);
  }
  static init<T extends BaseComponent = BaseComponent>(name: string, ctlr: any, config = {}): T | null {
    const Comp = this.instance.get(name);
    if (!Comp) return null;
    const instance = new Comp(ctlr, config) as T;
    return instance.create(), instance.setup();
  }
  static getAll(): ComponentConstructor[] {
    return this.instance.getAll();
  }
}

export class IconRegistry extends BaseRegistry<string> {
  private static instance = new IconRegistry();

  static get(name: string) {
    return this.instance.get(name) || `<svg></svg>`;
  }
  static register(name: string, svgContent: string): void {
    this.instance.register(name, svgContent);
  }
  // Bulk register a map of icons { play: "<svg...>", pause: "<svg...>" }
  static registerAll(icons: Record<string, string>): void {
    Object.keys(icons).forEach((k) => this.instance.register(k, icons[k]));
  }
}
