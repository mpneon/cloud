import { RequestHandler, Request, AppContext } from '../types';
import Response from './Response';

export default class Route {
    constructor(
        protected $path: string,
        protected $handler: RequestHandler
    ) {}

    async run(request: Request, context: AppContext): Promise<Response> {
        return this.newResponse(await this.$handler(request, context));
    }

    protected newResponse(input: any): Response {
        if (input instanceof Response) {
            return input;
        }

        return new Response(input);
    }
}