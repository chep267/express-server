/**
 *
 * @author dongntd267@gmail.com
 *
 */

/** libs */
import dotenv from 'dotenv';

dotenv.config();

export const AccountTest = {
    email: process.env.CHEP_SERVER_ACC_TEST_EMAIL,
    password: process.env.CHEP_SERVER_ACC_TEST_PASSWORD
};
