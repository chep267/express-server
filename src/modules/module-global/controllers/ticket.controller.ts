/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { StatusCodes } from 'http-status-codes';

/** constants */
import { TicketStatus } from '@module-global/constants/ticket';

/** utils */
import { genResponse } from '@module-base/utils/api';
import { createTicket, generateTicket } from '@module-global/utils/ticket';

/** types */
import type { Request, Response } from 'express';

type TypeTicketData = App.ModuleGlobal.Data.TypeTicketData;

let tickets = generateTicket(99);

const getAll = (_req: Request, res: Response) => {
    const itemIds = tickets.map((item) => item.id);
    res.status(StatusCodes.OK).json(genResponse({ data: { itemIds, items: tickets } }));
};

const get = (req: Request<{ id: TypeTicketData['id'] }>, res: Response) => {
    const { id } = req.params;
    const item = tickets.find((item) => item.id === id);
    res.status(StatusCodes.OK).json(genResponse({ data: item }));
};

const post = (
    req: Omit<Request, 'body'> & { body: Omit<TypeTicketData, 'id' | 'createdAt' | 'updatedAt'> },
    res: Response
) => {
    const newItem = createTicket({ ...req.body, id: `${tickets.length + 1}` });
    tickets.push(newItem);
    res.status(StatusCodes.OK).json(genResponse({ data: newItem }));
};

const put = (req: Omit<Request<{ id: TypeTicketData['id'] }>, 'body'> & { body: TypeTicketData }, res: Response) => {
    const { id } = req.params;
    const updateItem = req.body;

    let output;
    tickets = tickets.map((item) => {
        if (item.id === id) {
            output = { ...item, ...updateItem };
            output.updatedAt = Date.now();
            return output;
        }
        return item;
    });
    res.status(StatusCodes.OK).json(genResponse({ data: output }));
};

const patch = (
    req: Omit<Request<{ id: TypeTicketData['id'] }>, 'body'> & { body: Partial<TypeTicketData> },
    res: Response
) => {
    const { id } = req.params;
    const updateItem = req.body;

    let output;
    tickets = tickets.map((item) => {
        if (item.id === id) {
            output = { ...item, ...updateItem };
            output.updatedAt = Date.now();
            return output;
        }
        return item;
    });
    res.status(StatusCodes.OK).json(genResponse({ data: output }));
};

const remove = (req: Request<{ id: TypeTicketData['id'] }>, res: Response) => {
    const { id } = req.params;
    tickets = tickets.filter((item) => item.id !== id);
    res.status(StatusCodes.OK).json(genResponse({ message: 'This ticket deleted successfully!' }));
};

const getStatus = (_req: Request, res: Response) => {
    const status = Object.values(TicketStatus);
    res.status(StatusCodes.OK).json(genResponse({ data: status }));
};

export const ticketController = {
    getAll,
    get,
    post,
    put,
    patch,
    delete: remove,
    getStatus
};
