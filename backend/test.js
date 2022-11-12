import LeetCodeUser from "./dataFetching/LeetCodeUser.js"

const user = new LeetCodeUser("shenghaowu")
const res = await user.getRecentSubmissionList()
console.log(res);