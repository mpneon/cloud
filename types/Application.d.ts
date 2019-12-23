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
   * 声明定时任务 
   * 只支持标准 Cron 表达式（不含秒、年）
   */
  cron(expression: string, handler: RequestHandler): this;

  /**
   * 云函数入口
   * @param event
   * @param context
   */
  handle(event: any, context: any): Promise<any>;
}
