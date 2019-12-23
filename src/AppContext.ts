import { inject, autoInjectable } from "tsyringe";
import { AppContext as AppContextContract, Container } from "../types";

@autoInjectable()
export default class AppContext implements AppContextContract {
  constructor(@inject("container") protected $container: Container) {}

  get cloud() {
    return this.$container.resolve("cloud");
  }

  get db() {
    return this.$container.resolve("db");
  }
}
