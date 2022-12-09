import { LazyRouter } from 'lazy-toolbox';
import { FastifyRequest, FastifyReply } from 'fastify';
module.exports = (route: string, fastify: any, router: LazyRouter, db: any) => {
    const login = async (request: FastifyRequest, reply: FastifyReply) => {
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
