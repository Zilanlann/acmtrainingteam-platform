import fetch from "node-fetch";

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

  static async getCodeforcesUserAvatars(handleArray) {
    const url = `https://codeforces.com/api/user.info?handles=${handleArray.join(
      ";"
    )}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.result.map((item) => {
      return {
        codeforces_handle: item.handle,
        codeforces_avatar: item.avatar.substring(31),
      };
    });
  }
}
