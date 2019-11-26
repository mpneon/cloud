import { RequestHandler, Request, Response } from './index';

export interface Router {
  /**
   * 注册路由
   * @param path
   * @param handler
   */
  register<Result = any>(path: string, handler: RequestHandler<Result>): this;

  /**
   * 处理请求
   * @param request
   */
  dispatch(request: Request): Promise<Response>;
}
