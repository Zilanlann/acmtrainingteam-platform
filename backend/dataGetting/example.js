import LeetCodeUser from "./LeetCodeUser.js"
import LeetCodeTransformer from './LeetCodeTransformer.js';
import CodeforcesUser from './CodeforcesUser.js';
import CodeforcesTransformer from "./CodeforcesTransformer.js";

// const user = new LeetCodeUser("shenghaowu")
// const submissionList = await user.getRecentSubmissionList()
// const res = LeetCodeTransformer.transformSubmissions(submissionList, 1);
// console.log(res);


const user = new CodeforcesUser('wushenghao');
const submissionList = await user.getSubmissionList();
const res = CodeforcesTransformer.transformSubmissions(submissionList, 1);
console.log(res);