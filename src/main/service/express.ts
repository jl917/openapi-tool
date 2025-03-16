import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AddressInfo } from 'net';
import portscanner from 'portscanner';

interface ExpProxy {
    target: string;
    path: string;
}

export class ExpressApp {
    private app: express.Application;
    private server: any;
    private startingPort: number = 4200;
    private currentPort: number | null = null;
    private proxyList: ExpProxy[] = [{ target: 'https://randomuser.me', path: '/ran' }];

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeProxy();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private initializeProxy(): void {

        for (const { target, path } of this.proxyList) {
            const proxyOptions = {
                target,
                changeOrigin: true,
                pathRewrite: {
                    [`^${path}`]: '/api',
                },
            };
            this.app.use(path, createProxyMiddleware(proxyOptions));
        }
    }

    private initializeRoutes(): void {
        this.app.get('/health', (req: Request, res: Response) => {
            res.status(200).json({ status: 'OK', port: this.currentPort });
        });
    }

    private initializeErrorHandling(): void {
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack);
            res.status(500).json({
                error: {
                    message: 'Internal Server Error',
                    details: process.env.NODE_ENV === 'development' ? err.message : undefined
                }
            });
        });
    }

    private async findAvailablePort(startPort: number): Promise<number> {
        const port = await portscanner.findAPortNotInUse(startPort, startPort + 1000, '127.0.0.1');
        if (!port) {
            throw new Error('Could not find an available port');
        }
        return port;
    }

    public async start(): Promise<number> {
        if (this.server) {
            throw new Error('Server is already running');
        }

        this.currentPort = await this.findAvailablePort(this.startingPort);

        return new Promise((resolve) => {
            this.server = this.app.listen(this.currentPort, () => {
                const address = this.server.address() as AddressInfo;
                console.log(`Server is running on port ${address.port}`);
                resolve(address.port);
            });
        });
    }

    public async restart(): Promise<number> {
        await this.stop();
        return this.start();
    }

    public async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.server) {
                resolve();
                return;
            }

            this.server.close((err: Error) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.server = null;
                this.currentPort = null;
                resolve();
            });
        });
    }

    public getPort(): number | null {
        return this.currentPort;
    }

    public getApp(): express.Application {
        return this.app;
    }
}

const expressApp = new ExpressApp();

export const getPort = () => {
    return expressApp.getPort();
}

export default expressApp;
