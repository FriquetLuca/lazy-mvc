import { LazyRouter } from 'lazy-toolbox';
import { LazyMapper } from '@lazy-toolbox/portable';
module.exports = (route: string, fastify: any, router: LazyRouter, db: any) => {
    const dummyUsers = [ // Some dummy data for illustration purposes
        { name: "John", age: 28 },
        { name: "Elena", age: 31 },
        { name: "Arthur", age: 66 },
        { name: "Sophie", age: 17 },
        { name: "Peter", age: 19 },
        { name: "Yohan", age: 85 },
        { name: "Gertrude", age: 73 },
        { name: "Alexandre", age: 34 },
        { name: "Didier", age: 52 },
        { name: "Raoult", age: 52 }
    ];
    const controller = async (request: any, reply: any) => {
        /* DB handling example : 
        const db = Controller.makeDb(this.db);
        try {
            const someRows = await db.query('SELECT * FROM some_table');
            // do something with someRows and otherRows
        } catch (err) {
            // handle the error
        } finally {
            await db.close();
        } */
        const pageNumber = Math.max(1, LazyMapper.defaultNumber(request.params.nbr, 1));
        const currentView = router.view({
            viewPath: 'category/newCategory',
            request: request,
            reply: reply,
            datas: {
                'getPage': pageNumber.toString()
            },
            templates: {
                'userCard': (i: number) => {
                    const user = dummyUsers[(pageNumber - 1) * 2 + i];
                    return {
                        'username': user.name,
                        'age': user.age.toString()
                    };
                }
            },
            overrideTemplateCount: {
                'userCard': 5
            }
        }, Boolean(process.env.RTR_ROUTES));
        return reply.type('text/html').send(currentView);
    };
    fastify.get(route, controller);
    fastify.get(`${route}/:nbr`, controller);
};
