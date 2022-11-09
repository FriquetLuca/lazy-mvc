import fs from "fs";
import path from 'path';
import { parse } from 'node-html-parser';
import util from 'util';
import mysql from 'mysql';
export abstract class Controller {
    protected db: any;
    constructor(db: any) {
        this.db = db;
    }
    protected static makeMySQLDb(config: any) {
        const connection = mysql.createConnection( config );
        return {
            query( sql: string | mysql.QueryOptions) {
                return util.promisify(connection.query)
                    .call(connection, sql);
            },
            close() {
                return util.promisify(connection.end)
                    .call(connection);
            },
            beginTransaction() {
                return util.promisify(connection.beginTransaction)
                    .call(connection);
            },
            commit() {
                return util.promisify(connection.commit)
                    .call(connection);
            },
            rollback() {
                return util.promisify(connection.rollback)
                    .call(connection);
            }
        };
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
    protected static getView(viewPath: string): string {
        return fs.readFileSync(path.join(__dirname, '../../public/views/', viewPath)).toString();
    }
    protected static async view(provided: {viewPath:string, request:any, reply:any, includes?: {[viewName: string]: string} }, datas: {[propertyName: string]: string} = {}): Promise<any> {
        const document = parse(Controller.getView(provided.viewPath));
        for(let viewName in provided.includes) {
            const viewPath = provided.includes[viewName];
            const dataElements = document.querySelectorAll(`insert[view=${viewName}]`);
            const actualView = Controller.getView(viewPath);
            for(let dataElement of dataElements) {
                dataElement.replaceWith(actualView);
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