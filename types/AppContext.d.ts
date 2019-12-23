import * as Cloud from 'wx-server-sdk';

export interface AppContext {
  cloud: Cloud;
  db: ReturnType<Cloud.database>;
}
