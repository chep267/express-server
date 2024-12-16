/** models */
import { UserModel } from '../models/user.model.js';
const create = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const userFind = await UserModel.findOne({ email }).exec();
        // Fail
        if (userFind) {
            res.status(405).json({ message: 'Account already exists!' });
            return;
        }
        // Success
        const user = {
            email,
            password
        };
        res.status(200).json({ message: 'ok', data: { user } });
    }
    catch (error) {
        next(error);
    }
};
export const apiUser = {
    create
};
