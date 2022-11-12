import fetch, { Headers } from "node-fetch"
const userName = "shenghaowu"

var myHeaders = new Headers()
myHeaders.append("content-type", "application/json")

var graphql = JSON.stringify({
    query: `query getRecentSubmissionList($username: String!) {
	recentSubmissions(userSlug: $username) {
		id submitTime status question {
			title difficulty titleSlug topicTags{
				name
			}
		}
	}
}`,
    variables: { username: userName }
})
var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: graphql
}

fetch("https://leetcode.cn/graphql/", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error))