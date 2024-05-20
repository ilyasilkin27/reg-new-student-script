import createUser from './src/createUser.js';
import sendMail from './src/sendMail.js';
import main from './src/parseCsv.js';

(async () => {
    const userData = await main();
    await createUser(userData);
    await sendMail(userData);
})();