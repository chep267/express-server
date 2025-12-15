/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import path from 'node:path';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';

/** constant */
import { AppEnv } from '@constants/AppEnv.js';

/** configs */
import { mongoose as chepDB, dbConfig } from '@configs/database.js';

/** routes */
import { rootRouter } from '@routes/index.js';

const dirname = path.resolve();
const app = express();

app.use(express.static(path.join(dirname, 'public')));
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || AppEnv.appWhiteList.split(';').includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger('dev'));
app.use(rootRouter);

chepDB.connect(dbConfig.uri, { dbName: dbConfig.name, bufferCommands: false }).then();

export default app;
