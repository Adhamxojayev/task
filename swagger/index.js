import swaggerJSDoc from "swagger-jsdoc";
import {serve, setup} from 'swagger-ui-express';
import { Router } from "express";
import path from "path";

const router = Router();

const swaggerDocs = swaggerJSDoc({
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'task api',
            description: 'api information',
            servers: [
                {
                    url: 'http://localhost:5000',
                }
            ]
        }
    },
    apis: [path.resolve(process.cwd(),'swagger/docs/*.yaml')]    
});

router.use("/api-docs", serve, setup(swaggerDocs));

export default router;