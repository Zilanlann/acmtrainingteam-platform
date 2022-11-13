import util from 'util';
import config from 'config';
import { createConnection } from 'mysql';
import LeetCodeStoring from './LeetCodeStoring.js';

const dbConfig = config.get('dbConfig');
const connection = createConnection(dbConfig);
console.log(`The database ${dbConfig.database} is connected.`);

// const user = new LeetCodeUser("shenghaowu")
// const res = await user.getRecentSubmissionList()
// console.log(res);

LeetCodeStoring.initializeConnection(connection);
LeetCodeStoring.getProblemList();
