import { Request as RequestConstract, Container } from "../types";

export default class Request implements RequestConstract {

  protected $container!: Container;

  protected constructor(protected $event: any, protected $context: any) {}

  static from(event: any, context: any, container: Container): Request {
    return new this(event, context).setContainer(container);
  }

  protected setContainer(container: Container): this {
    this.$container = container;
    return this;
  }

  get event() {
    return this.$event;
  }

  get context() {
    return this.$context;
  }

  get path() {
    return this.$event.$path;
  }
}
