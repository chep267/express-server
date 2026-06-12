/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'https';

/** constant */
import { AppEnv } from '@module-base/constants/env';

export let io: Server;

export const initSocket = (server: HTTPServer) => {
    io = new Server(server, {
        cors: {
            origin: function (origin, callback) {
                if (!origin || AppEnv.appWhiteList.split(';').includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        const id = socket.handshake.query.id as string;
        if (id) {
            socket.join(id);
            console.log(`User ${id} connected with socket ${socket.id}`);
        }

        socket.on('disconnect', () => {
            if (id) {
                console.log(`User ${id} disconnected`);
            }
        });
    });

    return io;
};
