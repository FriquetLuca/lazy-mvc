import path from 'path';
import { parse } from 'node-html-parser';
import { LazyFS } from "lazy-toolbox";
export abstract class Controller {
    protected db: any;
    constructor(db: any) {
        this.db = db;
    }
    protected static mapNumber(supposedNumber: any, defaultValue: number) {
        let result = defaultValue;
        if(supposedNumber !== undefined && supposedNumber !== null) {
            result = Number(supposedNumber);
        }
        return result;
    }
    protected static mapString(supposedString: any, defaultValue: string) {
        let result = defaultValue;
        if(supposedString !== undefined && supposedString !== null) {
            result = supposedString.toString();
        }
        return result;
    }
    protected static async getView(viewPath: string): Promise<string> {
        const getFile = await LazyFS.readFile(path.join(__dirname, '../../public/views/', viewPath));
        return getFile.toString();
    }
    protected static async view(provided: {viewPath:string, request:any, reply:any, includes?: {[viewName: string]: string} }, datas: {[propertyName: string]: string} = {}): Promise<any> {
        const document = parse(await Controller.getView(provided.viewPath));
        for(let viewName in provided.includes) {
            const viewPath = provided.includes[viewName];
            const dataElements = document.querySelectorAll(`insert[view=${viewName}]`);
            if(dataElements.length > 0) {
                const actualView = await Controller.getView(viewPath);
                for(let dataElement of dataElements) {
                    dataElement.replaceWith(actualView);
                }
            }
        }
        for(let dataName in datas) {
            const actualData = datas[dataName];
            const dataElements = document.querySelectorAll(`insert[data=${dataName}]`);
            for(let dataElement of dataElements) {
                dataElement.replaceWith(actualData);
            }
        }
        return provided.reply.type('text/html').send(document.toString());
    }
}