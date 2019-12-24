import { autoInjectable, inject } from "tsyringe";
import {
  Scheduler as SchedulerContract,
  Container,
  RequestHandler,
  Request
} from "../types";
import ScheduledTask from "./ScheduledTask";

@autoInjectable()
export default class Scheduler implements SchedulerContract {
  protected $tasks: ScheduledTask[] = [];

  constructor(@inject("container") protected $container: Container) {}

  register(cron: string, handler: RequestHandler) {
    this.$tasks.push(new ScheduledTask(cron, handler));

    return this;
  }

  async dispatch(request: Request) {
    console.info("正在准备定时任务…");

    const context = this.$container.resolve("context");
    const dueTasks = this.$tasks.filter(task => task.isDue());

    if (!dueTasks.length) {
      console.info("没有需要执行的定时任务。");
    }

    let successCount = 0;
    for (const task of dueTasks) {
      console.info(`执行定时任务：${task.getDisplayName()}`);
      try {
        await task.run(request, context);
        successCount++;
      } catch (e) {
        console.error(e);
      }
    }

    return successCount;
  }
}
