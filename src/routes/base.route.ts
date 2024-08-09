/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';

const serverPort = process.env.CHEP_SERVER_PORT;

export const baseRouter = Router();

baseRouter.get('/', (_req, res) => {
    res.status(200).json(`chep-server start in port: ${serverPort}`);
});
