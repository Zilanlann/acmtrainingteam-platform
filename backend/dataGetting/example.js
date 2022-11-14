import LeetCodeUser from "./LeetCodeUser.js"
import DataTransformer from "./DataTransformer.js";

const user = new LeetCodeUser("shenghaowu")
const submissionList = await user.getRecentSubmissionList()
const res = DataTransformer.transformLeetCodeSubmissions(submissionList, "shenghaowu")
console.log(res);