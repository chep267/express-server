/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import express from 'express';
import https from 'https';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';

/** configs */
import { mongoose as chepDB, dbConfig } from '@config/database';

/** routes */
import { baseRouter } from '@route/base.route';
import { authRouter } from '@route/auth.route';
import { testRouter } from '@route/test.route';

/** utils */
import { connected } from '@util/log.mts';

const serverPort = process.env.CHEP_SERVER_PORT;
const whitelist = `${process.env.CHEP_SERVER_WHITE_LIST}`;

const app = express();
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || whitelist.split(';').includes(origin)) {
                callback(null, true);
            } else {
                console.log('origin:', origin, 'not allowed');
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    })
);
// app.use(cors({ origin: `https://${clientHost}:${clientVuePort}`, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger('dev'));
app.use(baseRouter);
app.use(authRouter);
app.use(testRouter);
app.use((req, res) => {
    res.status(404).json('This api not found!');
});

https
    .createServer(
        {
            key: fs.readFileSync('./src/utils/server.key'),
            cert: fs.readFileSync('./src/utils/server.cert')
        },
        app as never
    )
    .listen(serverPort, () => {
        console.log(connected(`chep-server https start in port: ${serverPort}`));
    });

chepDB.connect(dbConfig.uri, { dbName: dbConfig.name, bufferCommands: false }).then();
