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

export const Application: ApplicationConstructor;
