/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { Router } from 'express';

/** controllers */
import { apiTest } from '../controllers/test.controller';
import { apiAuth } from '../controllers/auth.controller';

export const testRouter = Router();

testRouter.use(apiAuth.verify);
testRouter.post('/app/feed', apiTest.feed);
testRouter.post('/app/messenger', apiTest.messenger);
