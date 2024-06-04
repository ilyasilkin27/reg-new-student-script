import createUser from './src/createUser.js';
import sendMail from './src/sendMail.js';
import main from './src/parseCsv.js';
import getUsers from './src/getUsers.js';

(async () => {
    await getUsers(); // Получаем данные студентов из AMOCRM и создаем csv документ
    const userData = await main(); // Парсим csv документ
    await createUser(userData); // Создаем юзерна в keycloak
    // await sendMail(userData); // Отправляем письмо на почту студенту
})();