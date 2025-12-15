/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import mongoose from 'mongoose';

/** constant */
import { AppEnv } from '@constants/AppEnv.js';

/** utils */
import { connected, disconnected, error, termination } from '@utils/log.js';

export const dbConfig = {
    name: AppEnv.dbName,
    uri: AppEnv.dbUri,
    host: AppEnv.dbHost,
    port: AppEnv.dbPort
};

mongoose.connection.on('connected', function () {
    console.log(connected('Mongoose default connection is open to', dbConfig.uri));
});
mongoose.connection.on('error', function (err) {
    console.log(error('Mongoose default connection has occurred ' + err + ' error'));
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
