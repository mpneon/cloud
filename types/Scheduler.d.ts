import { RequestHandler, Request } from './index';

export interface Scheduler {
  /**
   * 注册定时任务
   */
  register<Result = any>(cron: string, handler: RequestHandler<Result>): this;

  /**
   * 处理请求
   */
  dispatch(request: Request): Promise<any>;
}
