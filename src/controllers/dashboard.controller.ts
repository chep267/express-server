/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import { StatusCodes } from 'http-status-codes';

/** utils */
import { genResponse } from '@utils/genResponse';
import { createTicket, generateTasks, TypeTaskData } from '@utils/genTicket';

/** types */
import type { Request, Response } from 'express';

let tickets = generateTasks(99);

const getAll = (_req: Request, res: Response) => {
    const itemIds = tickets.map((item) => item.id);
    res.status(StatusCodes.OK).json(genResponse({ data: { itemIds, items: tickets } }));
};

const get = (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const item = tickets.find((item) => item.id === id);
    res.status(StatusCodes.OK).json(genResponse({ data: item }));
};

const post = (req: Omit<Request, 'body'> & { body: Omit<TypeTaskData, 'id' | 'createdAt' | 'updatedAt'> }, res: Response) => {
    const newItem = createTicket({ ...req.body, id: `${tickets.length + 1}` });
    tickets.push(newItem);
    res.status(StatusCodes.OK).json(genResponse({ data: newItem }));
};

const put = (req: Omit<Request<{ id: string }>, 'body'> & { body: Partial<TypeTaskData> }, res: Response) => {
    const { id } = req.params;
    const updateItem = req.body;

    let output;
    tickets = tickets.map((item) => {
        if (item.id === id) {
            output = { ...item, ...updateItem };
            return output;
        }
        return item;
    });
    res.status(StatusCodes.OK).json(genResponse({ data: output }));
};

const patch = (req: Omit<Request<{ id: string }>, 'body'> & { body: Partial<TypeTaskData> }, res: Response) => {
    const { id } = req.params;
    const updateItem = req.body;

    let output;
    tickets = tickets.map((item) => {
        if (item.id === id) {
            output = { ...item, ...updateItem };
            return output;
        }
        return item;
    });
    res.status(StatusCodes.OK).json(genResponse({ data: output }));
};

const remove = (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    tickets = tickets.filter((item) => item.id !== id);
    res.status(StatusCodes.OK).json(genResponse({ message: 'This ticket deleted successfully!' }));
};

export const apiTicket = {
    getAll,
    get,
    post,
    put,
    patch,
    delete: remove
};
