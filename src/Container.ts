import "reflect-metadata";
import { container, instanceCachingFactory } from "tsyringe";
import { Container as ContainerContract } from "../types";
import { isConstructor } from "./helpers";

export default class Container implements ContainerContract {
  protected static $instance?: Container;

  static getInstance(): Container {
    if (!this.$instance) {
      this.$instance = new this();
    }
    return this.$instance;
  }

  protected constructor() {
    this.instance("container", this);
    (global as any).use = this.resolve.bind(this);
  }

  resolve<T = any>(key: string) {
    return container.resolve(key) as T;
  }

  register<T>(key: string, factory: any) {
    if (isConstructor<T>(factory)) {
      container.register<T>(key, {
        useClass: factory
      });
    } else {
      container.register<T>(key, {
        useFactory: () => {
          return factory(this);
        }
      });
    }
  }

  singleton<T>(key: string, factory: any) {
    if (isConstructor<T>(factory)) {
      container.register<T>(key, {
        useFactory: instanceCachingFactory(() => new factory())
      });
    } else {
      container.register<T>(key, {
        useFactory: instanceCachingFactory(() => factory(this))
      });
    }
  }

  instance<T>(key: string, instance: T) {
    container.register<T>(key, {
      useValue: instance
    });
  }
}
