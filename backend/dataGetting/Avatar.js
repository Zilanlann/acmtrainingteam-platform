import fetch from "node-fetch";

export default class Avatar {
  static async getLeetcodeUserAvatar(userName) {
    const url = `https://leetcode.cn/u/${userName}`;
    const response = await fetch(url);
    const result = await response.text();
    const pattern =
      /"image":{"@type":"ImageObject","contentUrl":"https:\/\/assets.leetcode.cn\/aliyun-lc-upload\/.+?.png/;
    return pattern.exec(result.substring(660, 1500))[0].substring(89);
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
