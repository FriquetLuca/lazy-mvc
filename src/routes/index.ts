import { LazyRouter } from 'lazy-toolbox';
module.exports = (route: string, fastify: any, router: LazyRouter, db: any) => {
    const index = async (request: any, reply: any) => {
        const currentView = router.view({
            viewPath: 'index',
            request: request,
            reply: reply
        }, Boolean(process.env.RTR_ROUTES));
        return reply.type('text/html').send(currentView);
    };
    fastify.get('/', index);
    fastify.get(route, index); // route = '/index'
};
