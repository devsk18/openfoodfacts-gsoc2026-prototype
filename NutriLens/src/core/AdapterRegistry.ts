import { Adapter } from "./Adapter";

export class AdapterRegistry {
  private static registry = new Map<string, new () => Adapter>();

  static register(hostname: string, adapter: new () => Adapter): void {
    this.registry.set(hostname, adapter);
  }

  // factory method — resolves and instantiates correct adapter
  static resolve(hostname: string): Adapter | null {
    const AdapterClass = this.registry.get(hostname);
    return AdapterClass ? new AdapterClass() : null;
  }
}