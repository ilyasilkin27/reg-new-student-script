import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default async (userDataArray) => {
    try {
        let transporter = createTransport({
            host: 'smtp.yandex.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
        });

        for (const userData of userDataArray) {
            if (!userData.email) {
                console.error('Email not defined for user:', userData);
                continue;
            }

            let mailOptions = {
                from: process.env.MAIL_USER,
                to: userData.email,
                subject: 'Добро пожаловать!',
                text: `Привет, ${userData.firstName} ${userData.lastName}! Вы успешно зарегистрированы. Вот ваша ссылка: https://lms.hexly.ru/`
            };

            let info = await transporter.sendMail(mailOptions);
            console.log('Email отправлен для пользователя', userData.username, ':', info.messageId);
        }
    } catch (error) {
        console.error('Ошибка при отправке писем:', error);
        throw error;
    }
};
