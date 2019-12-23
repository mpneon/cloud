import { Request, AppContext } from "./index";
export interface RequestHandler<Result = any> {
  (request: Request, context: AppContext): Promise<Result>;
}
