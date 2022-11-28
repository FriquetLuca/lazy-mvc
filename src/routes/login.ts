import { LazyRouter } from 'lazy-toolbox';
module.exports = (route: string, fastify: any, router: LazyRouter, db: any) => {
    const login = async (request: any, reply: any) => {
        const currentView = router.view({
            viewPath: 'login',
            request: request,
            reply: reply
        }, Boolean(process.env.RTR_ROUTES));
        return reply.type('text/html').send(currentView);
    };
    fastify.get(route, login);
    fastify.get(`${route}/`, login);
};
