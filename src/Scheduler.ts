import { autoInjectable, inject } from "tsyringe";
import { Scheduler as SchedulerContract, Container, RequestHandler, Request } from "../types";
import ScheduledTask from "./ScheduledTask";

@autoInjectable()
export default class Scheduler implements SchedulerContract {

    protected $tasks: ScheduledTask[] = [];

    constructor(
        @inject('container') protected $container: Container
    ) {
    }

    register(cron: string, handler: RequestHandler) {
        this.$tasks.push(new ScheduledTask(cron, handler));

        return this;
    }

    dispatch(request: Request) {

        const context = this.$container.resolve('context');

        return Promise.all(this.$tasks.filter(task => task.isDue()).map(task => task.run(request, context)));
    }
}
