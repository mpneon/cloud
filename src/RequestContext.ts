import { inject, autoInjectable } from "tsyringe";
import { RequestContext as RequestContextContract, Container } from "../types";

@autoInjectable()
export default class RequestContext implements RequestContextContract {
  constructor(@inject("container") protected $container: Container) {}

  get cloud() {
    return this.$container.resolve("cloud");
  }

  get db() {
    return this.$container.resolve("db");
  }
}
