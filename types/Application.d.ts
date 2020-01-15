import { RequestHandler, AppContext } from './index';

export interface Application {

  /**
   * 当前版本
   * @since 1.3.0
   */
  readonly version: string;

  /**
   * 声明路由
   * @param path
   * @param handler
   */
  route(path: string, handler: RequestHandler): this;

  /**
   * 批量声明路由
   * @param route
   */
  routes(routesFactory: (route: this['route']) => any): this;

  /**
   * 声明定时任务 
   * 只支持标准 Cron 表达式（不含秒、年）
   * @since 1.2.0
   */
  cron(expression: string, handler: RequestHandler): this;

  /**
   * 云函数入口
   * @param event
   * @param context
   */
  handle(event: any, context: any): Promise<any>;

  /**
   * 自定义当前用户解析
   * @since 1.1.0
   */
  useUserResolver(resolveUser: (openid: string, context: AppContext) => Promise<any>): void;
}
