import util from 'util';
import config from 'config';
import { createConnection } from 'mysql';
import LeetCodeStoring from './LeetCodeStoring.js';
import LeetCodeUser from '../dataGetting/LeetCodeUser.js';
import LeetCodeTransformer from '../dataGetting/LeetCodeTransformer.js';

const dbConfig = config.get('dbConfig');
const connection = createConnection(dbConfig);
console.log(`The database ${dbConfig.database} is connected.`);
connection.query = util.promisify(connection.query);

const user = new LeetCodeUser('shenghaowu');
const submissionList = await user.getRecentSubmissionList();
const transformedData = LeetCodeTransformer.transformSubmissions(submissionList, 1);

LeetCodeStoring.initializeConnection(connection);
const res = await LeetCodeStoring.storeSubmissions(transformedData.leetCodeSubmission);
console.log(res);
const res2 = await LeetCodeStoring.storeProblems(transformedData.leetCodeProblem);
console.log(res2);
const res3 = await LeetCodeStoring.storeTags(transformedData.problemTag)
console.log(res3);
