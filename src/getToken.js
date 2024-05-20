import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const getToken = async () => {
    try {
        const formData = `client_id=${encodeURIComponent(process.env.CLIENT_ID)}&username=${encodeURIComponent(process.env.USERNAME)}&password=${encodeURIComponent(process.env.PASSWORD)}&grant_type=${encodeURIComponent(process.env.GRANT_TYPE)}`;

        const response = await axios.post('https://keycloak.hexly.ru/realms/master/protocol/openid-connect/token', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Ошибка при получении токена:', error.response.data);
        return null;
    }
};

export default getToken;