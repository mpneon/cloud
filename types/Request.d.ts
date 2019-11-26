import { Database } from "./index";

export interface Request {

  readonly event: any;

  readonly context: any;

  readonly path: string;
}
