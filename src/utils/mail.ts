/**
 *
 * @author dongntd267@gmail.com on 26/07/2023.
 *
 */

/** libs */
import nodemailer from 'nodemailer';

/** libs */
import { AppEnv } from '@constants/AppEnv';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: AppEnv.service.mail,
        pass: AppEnv.service.smtp
    }
});

export const sendRecoverEmail = async (email: string, resetLink?: string) => {
    return transporter.sendMail({
        from: '"Tola Chep" <no-reply@tolachep.com>',
        to: email,
        subject: 'Khôi phục mật khẩu của bạn',
        html: `
            <h1>Yêu cầu khôi phục tài khoản</h1>
            <p>Chào bạn, hãy click vào link dưới đây để đặt lại mật khẩu:</p>
            <a href="${resetLink}" style="padding: 10px 20px; background: blue; color: white;">Khôi phục ngay</a>
            <p>Link này sẽ hết hạn sau 15 phút.</p>
        `
    });
};
