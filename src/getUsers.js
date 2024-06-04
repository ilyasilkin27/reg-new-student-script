import axios from 'axios';
import dotenv from 'dotenv';
import { createObjectCsvWriter } from 'csv-writer';

dotenv.config();

const accessToken = process.env.AMO_TOKEN;
const domain = process.env.AMO_DOMAIN;

const csvWriter = createObjectCsvWriter({
    path: 'students.csv',
    header: [
        { id: 'username', title: 'username' },
        { id: 'firstName', title: 'firstName' },
        { id: 'lastName', title: 'lastName' },
        { id: 'email', title: 'email' },
        { id: 'enabled', title: 'enabled' },
        { id: 'credential_type', title: 'credential_type' },
        { id: 'credential_value', title: 'credential_value' },
        { id: 'credential_temporary', title: 'credential_temporary' }
    ]
});

const getDealsByPipeline = async (pipelineId, page = 1, allDeals = []) => {
    try {
        const response = await axios.get(`https://${domain}/api/v4/leads`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                pipeline_id: pipelineId,
                page,
                limit: 250
            }
        });

        const deals = response.data._embedded.leads;
        allDeals = allDeals.concat(deals);

        const links = response.data._links;
        if (links && links.next) {
            return getDealsByPipeline(pipelineId, page + 1, allDeals);
        } else {
            return allDeals;
        }
    } catch (error) {
        console.error(`Ошибка при получении сделок для воронки ${pipelineId}:`, error.response ? error.response.data : error.message);
        return allDeals;
    }
};

const extractStudentData = (deal) => {
    const fioField = deal.custom_fields_values ? deal.custom_fields_values.find(field => field.field_name === 'ФИО абитуриента') : null;
    const fio = fioField ? fioField.values[0].value : 'Unknown Unknown';
    const [firstName, lastName] = fio.split(' ');

    const emailLMSField = deal.custom_fields_values ? deal.custom_fields_values.find(field => field.field_name === 'E-mail LMS') : null;
    const email = emailLMSField ? emailLMSField.values[0].value : '';

    return {
        username: `${firstName} ${lastName}`,
        firstName: firstName || 'Unknown',
        lastName: lastName || 'Unknown',
        email,
        enabled: true,
        credential_type: 'password',
        credential_value: email.split('@')[0],
        credential_temporary: false
    };
};

export default async () => {
    const pipelineId = 5460232;
    const targetStatus = 'СПО: ОПЛАЧЕНО';
    let allStudentDeals = [];

    const allDeals = await getDealsByPipeline(pipelineId);
    console.log(`Total deals in pipeline ${pipelineId}: ${allDeals.length}`);

    const statuses = await axios.get(`https://${domain}/api/v4/leads/pipelines/${pipelineId}/statuses`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(response => response.data._embedded.statuses)
    .catch(error => {
        console.error(`Ошибка при получении статусов для воронки ${pipelineId}:`, error.response ? error.response.data : error.message);
        return [];
    });

    const targetStatusId = statuses.find(status => status.name === targetStatus)?.id;

    if (!targetStatusId) {
        console.error(`Не найден статус "${targetStatus}" в воронке "${pipelineId}"`);
        return;
    }

    const filteredDeals = allDeals.filter(deal => deal.status_id === targetStatusId && deal.pipeline_id === pipelineId);
    console.log(`Filtered deals with status "${targetStatus}" in pipeline ${pipelineId}: ${filteredDeals.length}`);

    for (const deal of filteredDeals) {
        console.log(`Processing deal: ${deal.id}, status: ${deal.status_id}`);
        const studentData = extractStudentData(deal);
        allStudentDeals.push(studentData);
    }

    await csvWriter.writeRecords(allStudentDeals);
    console.log('Данные студентов успешно записаны в students.csv');
};