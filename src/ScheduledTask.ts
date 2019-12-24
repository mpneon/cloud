import parser from "cron-parser";
import { RequestHandler, Request, AppContext } from "../types";

export default class ScheduledTask {
  constructor(
    protected $expression: string,
    protected $handler: RequestHandler
  ) {}

  /**
   * 是否应当执行（当前时间满足 cron 表达式）
   */
  isDue(): boolean {
    return this.isSameMinute();
  }

  protected isSameMinute(): boolean {
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);
    try {
      const interval = parser.parseExpression(this.$expression);
      return +interval.prev().toDate() === +now;
    } catch (err) {
      return false;
    }
  }

  async run(request: Request, context: AppContext): Promise<any> {
    return this.$handler(request, context);
  }

  getDisplayName(): string {
    return this.$handler.name ?? '[anonymous]';
  }
}
