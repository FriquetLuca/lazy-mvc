import { HomeController } from '../controller/homeController';
module.exports = (route: string, fastify: any, db: any) => {
    const controller = new HomeController(db);
    fastify.get('/', controller.index);
    fastify.get(route, controller.index);
};