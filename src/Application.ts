import cloud from "wx-server-sdk";
import {
  Router,
  Application as ApplicationContract,
  RequestHandler
} from "../types";
import DefaultRouter from "./Router";
import Request from "./Request";
import Container from "./Container";
import AppContext from "./AppContext";

export default class Application implements ApplicationContract {
  protected $container: Container = Container.getInstance();

  constructor(env: string = cloud.DYNAMIC_CURRENT_ENV) {
    this.$container.instance("app", this);
    this.$container.singleton("router", DefaultRouter);

    cloud.init({ env });
    this.$container.instance("cloud", cloud);
    this.$container.singleton("db", (container: Container) =>
      container.resolve<typeof cloud>("cloud").database()
    );
    this.$container.singleton<AppContext>("context", AppContext);
  }

  protected get $router(): Router {
    return this.$container.resolve<Router>("router");
  }

  route(path: string, handler: RequestHandler): this {
    this.$router.register(path, handler);

    return this;
  }

  routes(routesFactory: (route: (path: string, handler: any) => this) => any) {
    routesFactory(this.route.bind(this));

    return this;
  }

  async handle(event: any, context: any): Promise<any> {
    const request = Request.from(event, context, this.$container);

    if (this.$userResolver) {
      request.setUserResolver(this.$userResolver);
    }

    this.$container.instance("request", request);

    const response = await this.$router.dispatch(request);

    return response.getBody();
  }

  protected $userResolver?: any;

  useUserResolver(resolveUser: (openid: string, context: AppContext) => Promise<any>) {
    this.$userResolver = resolveUser;
  }
}
