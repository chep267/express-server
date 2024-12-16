/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */
/** libs */
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
import https from 'https';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
/** constant */
import { AppEnv } from './constants/AppEnv.js';
/** configs */
import { mongoose as chepDB, dbConfig } from './configs/database.js';
/** routes */
import { baseRouter } from './routes/base.route.js';
import { authRouter } from './routes/auth.route.js';
import { testRouter } from './routes/test.route.js';
/** utils */
import { connected } from './utils/log.js';
// Tạo __dirname
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const app = express();
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || AppEnv.appWhiteList.split(';').includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.get('/favicon.ico', (_req, res) => {
    res.sendFile(path.join(dirname, 'public', 'favicon.svg'));
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger('dev'));
app.use(baseRouter);
app.use(authRouter);
app.use(testRouter);
app.use((_req, res) => {
    res.status(404).json('This api not found!');
});
https
    .createServer({
    key: fs.readFileSync('./src/utils/server.key'),
    cert: fs.readFileSync('./src/utils/server.cert')
}, app)
    .listen(AppEnv.appPort, () => {
    console.log(connected(`chep-server https start in: https://localhost:${AppEnv.appPort}`));
});
chepDB.connect(dbConfig.uri, { dbName: dbConfig.name, bufferCommands: false }).then();
