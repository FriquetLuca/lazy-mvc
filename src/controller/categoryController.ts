import { Controller } from "./controller";
export class CategoryController extends Controller {
    private static newCategoryMapper(reqParams: any) {
        const getters = {
            id: Controller.mapNumber(reqParams.id, 1)
        };
        getters.id = getters.id >= 1 ? getters.id : 1;
        return getters;
    }
    public async newCategory(request: any, reply: any): Promise<any> {
        const mapping = CategoryController.newCategoryMapper(request.params);
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
        const provide = {
            viewPath: 'category/newCategory.html',
            request: request,
            reply: reply,
            includes: {
                'categHead': 'category/categoryHead.html'
            }
        };
        const insertDatas = {
            'getPage': mapping.id.toString()
        };
        return Controller.view(provide, insertDatas);
    }
}