import { RequestHandler, Request, RequestContext } from '../types';
import Response from './Response';

export default class Route {
    constructor(
        protected $path: string,
        protected $handler: RequestHandler
    ) {}

    async run(request: Request, context: RequestContext): Promise<Response> {
        return this.newResponse(await this.$handler(request, context));
    }

    protected newResponse(input: any): Response {
        if (input instanceof Response) {
            return input;
        }

        return new Response(input);
    }
}