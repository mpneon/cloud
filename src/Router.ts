import { inject, autoInjectable } from 'tsyringe';
import { Request, RequestHandler, Router as RouterContract, Container } from '../types';
import Route from './Route';

@autoInjectable()
export default class Router implements RouterContract {

    protected $routes: Map<string, Route> = new Map();

    constructor(
        @inject('container') protected $container: Container
    ) {
    }

    register(path: string, handler: RequestHandler) {
        this.$routes.set(path, new Route(path, handler));

        return this;
    }

    dispatch(request: Request) {
        const route = this.$routes.get(request.path);
        return route!.run(request, this.$container.resolve('context'));
    }
}