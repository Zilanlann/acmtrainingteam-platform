import util from 'util';
import config from 'config';
import { createConnection } from 'mysql';
import CodeforcesStoring from '../CodeforcesStoring.js';
import CodeforcesUser from '../../dataGetting/CodeforcesUser.js';
import CodeforcesTransformer from '../../dataGetting/CodeforcesTransformer.js';

const dbConfig = config.get('dbConfig');
const connection = createConnection(dbConfig);
console.log(`The database ${dbConfig.database} is connected.`);
connection.query = util.promisify(connection.query);

const user = new CodeforcesUser('wushenghao');
const submissionList = await user.getSubmissionList();
const transformedData = CodeforcesTransformer.transformSubmissions(submissionList, 1);

CodeforcesStoring.initializeConnection(connection);
const res = await CodeforcesStoring.storeSubmissions(transformedData.codeforcesSubmission);
console.log(res);
const res2 = await CodeforcesStoring.storeProblems(transformedData.codeforcesProblem);
console.log(res2);
const res3 = await CodeforcesStoring.storeTags(transformedData.problemTag)
console.log(res3);
