import { createReadStream } from 'fs';
import csv from 'csv-parser';

function parseCsv(filePath) {
  return new Promise((resolve, reject) => {
    const users = [];

    createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        users.push({
          username: row.username,
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email,
          enabled: row.enabled === 'true',
          credentials: [
            {
              type: row.credential_type,
              value: row.credential_value,
              temporary: row.credential_temporary === 'false' ? false : true
            }
          ]
        });
      })
      .on('end', () => {
        resolve(users);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function main() {
  const filePath = 'users.csv';
  try {
    const users = await parseCsv(filePath);
    return users;
} catch (error) {
    console.error('Error parsing CSV file:', error);
  }
};

export default main;