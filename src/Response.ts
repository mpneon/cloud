import { Response as ResponseContract } from "../types";
import HttpStatus from "./HttpStatus";

export default class Response implements ResponseContract {
  constructor(
    protected $body: any,
    public status: HttpStatus = HttpStatus.OK
  ) {}

  getBody() {
    return this.$body;
  }
}
