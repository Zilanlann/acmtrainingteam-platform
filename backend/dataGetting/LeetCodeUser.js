import fetch from "node-fetch";

// Package API(s) of one user of LeetCode
// Usage:
// const user = new LeetCodeUser("shenghaowu")
// const res = await user.getRecentSubmissionList()
export default class LeetCodeUser {
  constructor(userName) {
    this.userName = userName;
  }

  async getRecentSubmissionList() {
    const graphql = JSON.stringify({
      query: `query getRecentSubmissionList($username: String!) {
				recentSubmissions(userSlug: $username) {
					submission_id:id submit_time:submitTime status problem:question {
						problem_id:questionId title:translatedTitle difficulty title_slug:titleSlug tags:topicTags{
							name
								}
							}
						}
					}`,
      variables: { username: this.userName },
    });
    const requestOptions = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: graphql,
    };
    const response = await fetch("https://leetcode.cn/graphql/", requestOptions);
    const result = await response.json();
    if (result.data.recentSubmissions.length == 0) {
      throw new Error(`LeetCode user ${this.userName} may not exist, 
			or this user forbid to show his recent submissions.`);
    }
    return result.data.recentSubmissions;
  }
}
