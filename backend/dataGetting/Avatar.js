import fetch from "node-fetch";
import getProxyAgent from "./proxy/getProxyAgent.js";

export default class Avatar {
  static async getLeetcodeUserAvatar(userName) {
    const graphql = JSON.stringify({
      query: `query userProfilePublicProfile($userSlug: String!) {
				userProfilePublicProfile(userSlug: $userSlug) {
					profile{
						userAvatar
					}
				}
			}`,
      variables: { userSlug: userName },
      agent: getProxyAgent()
    });
    const requestOptions = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: graphql,
    };
    const response = await fetch(
      "https://leetcode.cn/graphql/",
      requestOptions
    );
    const result = await response.json();
    const avatar =
      result?.data?.userProfilePublicProfile?.profile?.userAvatar.substring(44);
    console.log(avatar);
    if (!avatar) {
      throw new Error(`LeetCode user ${userName} may not exist`);
    }
    return avatar;
  }

  static async getCodeforcesUserAvatar(handle) {
    const url = `https://codeforces.com/api/user.info?handles=${handle}`;
    const response = await fetch(url, { agent: getProxyAgent() });
    const result = await response.json();
    if (result.status === "OK") {
      return result?.result[0]?.avatar?.substring(31);
    } else {
      throw new Error(result?.comment);
    }
  }
}
