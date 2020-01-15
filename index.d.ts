import { Application as ApplicationContract } from "./types";

interface ApplicationConstructor {
  new (
    env?:
      | string
      | {
          database: string;
          storage: string;
          functions: string;
        }
  ): ApplicationContract;
}

declare global {
  /**
   * @since 1.3.0
   */
  function use(key: string): any;
}

export const Application: ApplicationConstructor;
