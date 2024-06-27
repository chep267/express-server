/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

import express from 'express';
import https from 'https';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';

/** configs */
import { mongoose as chepDB, dbConfig } from '@config/database.js';

/** routes */
import { baseRouter } from '@route/base.route.js';
import { authRouter } from '@route/auth.route.js';
import { testRouter } from '@route/test.route.js';

/** utils */
import { connected } from '@util/log.mts';

const serverPort = process.env.CHEP_SERVER_PORT;
const clientPort = process.env.CHEP_CLIENT_PORT;
const clientHost = process.env.CHEP_CLIENT_HOST;

const app = express();
app.use(cors({ origin: `https://${clientHost}:${clientPort}`, credentials: true }));
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
    .createServer(
        {
            key: fs.readFileSync('./src/utils/server.key'),
            cert: fs.readFileSync('./src/utils/server.cert')
        },
        app as any
    )
    .listen(serverPort, () => {
        console.log(connected(`chep-server https start in port: ${serverPort}`));
    });

chepDB.connect(dbConfig.uri, { dbName: dbConfig.name, bufferCommands: false }).then();
