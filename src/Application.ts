import cloud from "wx-server-sdk";
import {
  Router,
  Application as ApplicationContract,
  RequestHandler,
  Scheduler
} from "../types";
import DefaultRouter from "./Router";
import DefaultScheduler from './Scheduler';
import Request from "./Request";
import Container from "./Container";
import AppContext from "./AppContext";

export default class Application implements ApplicationContract {

  /**
   * 当前版本
   */
  protected $version: string = '1.3.0';

  protected $container: Container = Container.getInstance();

  constructor(env: string = cloud.DYNAMIC_CURRENT_ENV) {
    this.$container.instance("app", this);
    this.$container.singleton("router", DefaultRouter);
    this.$container.singleton('scheduler', DefaultScheduler);

    cloud.init({ env });
    this.$container.instance("cloud", cloud);
    this.$container.singleton("db", (container: Container) =>
      container.resolve<typeof cloud>("cloud").database()
    );
    this.$container.singleton<AppContext>("context", AppContext);
    console.info(`@mpneon/cloud version ${this.version}`);
  }

  get version() {
    return this.$version;
  }

  protected get $router(): Router {
    return this.$container.resolve<Router>("router");
  }

  protected get $scheduler(): Scheduler {
    return this.$container.resolve<Scheduler>('scheduler');
  }

  route(path: string, handler: RequestHandler): this {
    this.$router.register(path, handler);

    return this;
  }

  routes(routesFactory: (route: (path: string, handler: any) => this) => any) {
    routesFactory(this.route.bind(this));

    return this;
  }

  cron(expression: string, handler: RequestHandler): this {
    this.$scheduler.register(expression, handler);

    return this;
  }

  /**
   * 处理云函数调用
   * 1. 判断是否为定时触发器调用，如果是，路由到触发器
   * 2. 如果不是，路由到函数
   * @param event 
   * @param context 
   */
  async handle(event: any, context: any): Promise<any> {
    const request = Request.from(event, context, this.$container);
    this.$container.instance("request", request);

    if (event?.Type === 'Timer') {
      return this.$scheduler.dispatch(request);
    }

    if (this.$userResolver) {
      request.setUserResolver(this.$userResolver);
    }

    const response = await this.$router.dispatch(request);

    return response.getBody();
  }

  protected $userResolver?: any;

  useUserResolver(resolveUser: (openid: string, context: AppContext) => Promise<any>) {
    this.$userResolver = resolveUser;
  }
}
