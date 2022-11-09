import { Controller } from "./controller";
export class HomeController extends Controller {
    public async index (request: any, reply: any): Promise<any> {
        return Controller.view({
            viewPath: 'index.html',
            request: request,
            reply: reply
        });
    }
}