
import { CategoryController } from '../../controller/categoryController';
module.exports = (route: string, fastify: any, db: any) => {
    const controller = new CategoryController(db);
    fastify.get(route, controller.newCategory);
    fastify.get(`${route}/:id`, controller.newCategory);
};
