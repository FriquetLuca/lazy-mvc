import { LazySocket, LazyRouter, LazyNetList } from "lazy-toolbox";
import { dateLogMS } from "@lazy-toolbox/portable";
import path from "path";
import dotenv from "dotenv";
class App {
    private router: LazyRouter;
    private server: LazySocket;
    public static root: string = "";
    constructor() {
        console.log(dateLogMS("Network list:"));
        const ipv4s = LazyNetList.IPv4();
        for(let ipv4 of ipv4s) {
            console.log(dateLogMS(ipv4));
        }
        // Set the app root directory name
        App.root = __dirname;
        // Load .env file into process.env
        dotenv.config();
        // Create DB arguments
        const db = {
            host: process.env.HOST,
            port: process.env.DB_PORT,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE
        };
        // Create a router
        this.router = new LazyRouter(<string>process.env.HOST, Number(process.env.PORT), App.root, '../public/assets/', db);
        // Create a websocket
        this.server = new LazySocket(Number(process.env.SOCKET_PORT), path.join(App.root, './sockets/'));
        this.server.setDB(db);
    }
    public async start(): Promise<void> {
        // Load all assets
        await this.router.loadAssets();
        // Load all routes
        await this.router.registerPaths('./routes', '../public/views');
        // Start all socket connections
        this.server.connect();
        // Start the server
        this.router.start();
    }
}
const app = new App();
app.start();