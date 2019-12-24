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

    /**
     * fixme 处理没有路由匹配的情况
     */
    async dispatch(request: Request) {
        console.info(`请求路由：${request.path}`);
        const route = this.$routes.get(request.path);
        return route!.run(request, this.$container.resolve('context'));
    }
}