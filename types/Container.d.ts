/**
 * 对 tsyringe 的包装
 */
export interface Container {
  resolve<T = any>(key: string): T;

  register<T>(key: string, constructor: { new (...args: any[]): T }): void;
  register<T>(key: string, factory: (container: this) => T): void;

  singleton<T>(key: string, constructor: { new (...args: any[]): T }): void;
  singleton<T>(key: string, factory: (container: this) => T): void;

  instance<T>(key: string, instance: T): void;
}
