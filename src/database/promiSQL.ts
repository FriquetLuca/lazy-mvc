import util from 'util';
import mysql from 'mysql';
interface MySQLConnect {
    query(sql: string | mysql.QueryOptions): Promise<unknown>;
    close(): Promise<void>;
    beginTransaction(): Promise<void>;
    commit(): Promise<unknown>;
    rollback(): Promise<void>;
}
export class PromiSQL {
    static createConnection(config: any): MySQLConnect {
        const connection = mysql.createConnection( config );
        return {
            query( sql: string | mysql.QueryOptions): Promise<unknown> {
                return util.promisify(connection.query)
                    .call(connection, sql);
            },
            close(): Promise<void> {
                return util.promisify(connection.end)
                    .call(connection);
            },
            beginTransaction(): Promise<void> {
                return util.promisify(connection.beginTransaction)
                    .call(connection);
            },
            commit(): Promise<unknown> {
                return util.promisify(connection.commit)
                    .call(connection);
            },
            rollback(): Promise<void> {
                return util.promisify(connection.rollback)
                    .call(connection);
            }
        };
    }
}