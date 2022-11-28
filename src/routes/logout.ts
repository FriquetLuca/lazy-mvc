import { LazyRouter } from 'lazy-toolbox';
module.exports = (route: string, fastify: any, router: LazyRouter, db: any) => {
    const logout = async (request: any, reply: any) => {
        
    };
    fastify.get(route, logout);
    fastify.get(`${route}/`, logout);
};
