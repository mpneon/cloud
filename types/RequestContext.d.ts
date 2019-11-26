import * as Cloud from 'wx-server-sdk';

export interface RequestContext {
  cloud: Cloud;
  db: ReturnType<Cloud.database>;
}
