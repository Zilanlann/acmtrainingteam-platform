import fetch from "node-fetch"

// Package API(s) of one user of LeetCode
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
							submission_id:id submit_time:submitTime status question {
								title:translatedTitle difficulty title_slug:titleSlug tags:topicTags{
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