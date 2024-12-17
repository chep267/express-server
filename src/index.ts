/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// import https from 'https';
// import fs from 'fs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';

/** constant */
import { AppEnv } from '@constant/AppEnv';

/** configs */
import { mongoose as chepDB, dbConfig } from '@config/database';

/** routes */
import { baseRouter } from '@route/base.route';
import { authRouter } from '@route/auth.route';
import { testRouter } from '@route/test.route';

/** utils */
import { connected } from '@util/log';

// Tạo __dirname
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();
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

app.get('/favicon.ico', (_req, res) => {
    res.sendFile(path.join(dirname, 'public', 'favicon.svg'));
    // res.status(204);
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

// https
//     .createServer(
//         {
//             key: fs.readFileSync(path.join(dirname, 'public', 'server.key')),
//             cert: fs.readFileSync(path.join(dirname, 'public', 'server.cert'))
//         },
//         app as never
//     )
//     .listen(AppEnv.appPort, () => {
//         console.log(connected(`chep-server https start in: https://localhost:${AppEnv.appPort}`));
//     });

app.listen(AppEnv.appPort, () => {
    console.log(connected(`chep-server https start in: https://localhost:${AppEnv.appPort}`));
});
chepDB.connect(dbConfig.uri, { dbName: dbConfig.name, bufferCommands: false }).then();

export default app;
