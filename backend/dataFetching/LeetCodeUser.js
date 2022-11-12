import fetch from "node-fetch"

// Usage:
// const user = new LeetCodeUser("shenghaowu")
// const res = await user.getRecentSubmissionList()
export default class LeetCodeUser {
    constructor(userName) {
        this.userName = userName
    }

    async getRecentSubmissionList() {
        const graphql = JSON.stringify({
            query: `query getRecentSubmissionList($username: String!) {
						recentSubmissions(userSlug: $username) {
							id submitTime status question {
								title difficulty titleSlug topicTags{
									name
								}
							}
						}
					}`,
            variables: { username: this.userName }
        })
        const requestOptions = {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: graphql
        }
        const response = await fetch("https://leetcode.cn/graphql/", requestOptions)
        if (!response.ok) {
            throw new HTTPResponseError(response)
        }
        return (await response.json()).data.recentSubmissions
    }
}