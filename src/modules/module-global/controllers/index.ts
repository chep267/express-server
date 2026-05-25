/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** controllers */
import { ticketController } from '@module-global/controllers/ticket.controller';
import { poemController } from '@module-global/controllers/poem.controller';

export const appController = {
    ticket: ticketController,
    poem: poemController
};
