import { RequestHandler } from './index';

export interface Application {
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
   * 云函数入口
   * @param event
   * @param context
   */
  handle(event: any, context: any): Promise<any>;
}
