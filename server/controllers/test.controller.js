/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */
const feed = (_req, res) => {
    res.status(200).json({ message: 'feed', status: 200 });
};
const messenger = (_req, res) => {
    res.status(200).json({ message: 'messenger', status: 200 });
};
export const apiTest = {
    feed,
    messenger
};
