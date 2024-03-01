/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

import { Router } from 'express';

const serverPort = process.env.CHEP_SERVER_PORT;

export const baseRouter = Router();

// app.listen(3000, () => {
//     console.log(connected(`chep-server start in port: ${3000}`));
// });

baseRouter.get('/', (_req, res) => {
    res.status(200).json(`chep-server start in port: ${serverPort}`);
});
