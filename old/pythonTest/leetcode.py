import requests
import json


def getLeetcodeInformation(username: str) -> dict:
    # consts
    QUERYS = {
        # queryName: {path, query}
        "calendar": {
            "path": "/graphql/noj-go",
            "query": "query userProfileCalendar($userSlug: String!, $year: Int){userCalendar(userSlug: $userSlug, year: $year){submissionCalendar}}",
        },
        "recentACSubmissions": {
            "path": "/graphql/noj-go",
            "query": "query recentAcSubmissions($userSlug: String!){recentACSubmissions(userSlug: $userSlug) {submissionId\nsubmitTime\nquestion{\ntranslatedTitle\ntitleSlug\nquestionFrontendId}}}",
        },
        "rank": {
            "path": "/graphql/noj-go",
            "query": "query userContestRankingInfo($userSlug: String!){userContestRanking(userSlug: $userSlug) {attendedContestsCount\nrating\nglobalRanking\nlocalRanking\nglobalTotalParticipants\nlocalTotalParticipants\ntopPercentage}}",
        },
        "solvedProblem": {
            "path": "/graphql",
            "query": "query userQuestionProgress($userSlug: String!) {userProfileUserQuestionProgress(userSlug: $userSlug) {numAcceptedQuestions{\ndifficulty\ncount}numFailedQuestions{difficulty\ncount}numUntouchedQuestions{difficulty\ncount}}}"
        }
    }
    BASE_URL = "https://leetcode.cn"
    HEADERS = {
        'content-type': 'application/json'
    }

    result = dict()
    for queryName, query in QUERYS.items():
        payload = json.dumps({
            "query": query["query"],
            "variables": {
                "userSlug": username
            }
        })
        response = requests.request(
            "POST", BASE_URL + query["path"], headers=HEADERS, data=payload)
        print(response.apparent_encoding)
        result[queryName] = response.json()["data"]

    return result


print(getLeetcodeInformation("shenghaowu"))
