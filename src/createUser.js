import axios from 'axios';
import getToken from "./getToken.js";
import dotenv from 'dotenv';

dotenv.config();

export default async (users) => {
    const url = process.env.KCLOAK_URL;
    const token = await getToken();

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    for (const user of users) {
        try {
            const response = await axios.post(url, user, { headers });
            console.log('Пользователь успешно создан:', response.config.data);
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error.response.data.errorMessage
        );
        }
    }
};
