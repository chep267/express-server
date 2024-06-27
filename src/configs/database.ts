/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

import mongoose from 'mongoose';

/** utils */
import { connected, disconnected, error, termination } from '@util/log.mjs';

export const dbConfig = {
    name: `${process.env.CHEP_SERVER_DB_NAME}`,
    uri: `${process.env.CHEP_SERVER_DB_URI}`,
    host: `${process.env.CHEP_SERVER_DB_HOST}`,
    port: `${process.env.CHEP_SERVER_DB_PORT}`
};

mongoose.connection.on('connected', function () {
    console.log(connected('Mongoose default connection is open to', dbConfig.uri));
});
mongoose.connection.on('error', function (err) {
    console.log(error('Mongoose default connection has occured ' + err + ' error'));
});
mongoose.connection.on('disconnected', function () {
    console.log(disconnected('Mongoose default connection is disconnected'));
});
process.on('SIGINT', () => {
    mongoose.connection.close(true).then();
    console.log(termination('Mongoose default connection is disconnected due to application termination'));
    process.exit(0);
});

export { mongoose };
