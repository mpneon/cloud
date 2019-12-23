import {
  Request as RequestConstract,
  Container,
  RequestContext
} from "../types";

export default class Request implements RequestConstract {
  protected $container!: Container;

  protected $userResolver: (openid: string, context: RequestContext) => Promise<any> = Request.resolveUser;

  protected constructor(protected $event: any, protected $context: any) {}

  static from(event: any, context: any, container: Container): Request {
    return new this(event, context).setContainer(container);
  }

  protected static resolveUser(openid: string, { db }: RequestContext): Promise<any> {
    if (!openid) {
      return Promise.resolve(null);
    }

    // 不能直接使用 try catch
    // 因为 .get() 返回的 thenable 被魔改了
    // 如果不调用 .then() 就会直接云函数抛异常
    return new Promise(resolve => {
      db.collection("users")
        .doc(openid)
        .get()
        .then(resolve, () => resolve(null));
    });
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

  protected $user: any;

  get user() {
    if (!this.$user) {
      this.$user = this.resolveUser();
    }

    return this.$user;
  }

  protected resolveUser(): any {
    const context = this.$container.resolve('context');
    const { OPENID } = context.cloud.getWXContext();
    return this.$userResolver(OPENID, context);
  }

  setUserResolver(userResolver: (openid: string, context: RequestContext) => Promise<any>): void {
    this.$userResolver = userResolver;
  }
}
