/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** libs */
import dotenv from 'dotenv';

dotenv.config();

export const AccountTest = {
    email: process.env.VITE_APP_SERVER_ACC_TEST_EMAIL,
    password: process.env.VITE_APP_SERVER_ACC_TEST_PASSWORD
};
