import { Request, RequestContext } from "./index";
export interface RequestHandler<Result = any> {
  (request: Request, context: RequestContext): Promise<Result>;
}
