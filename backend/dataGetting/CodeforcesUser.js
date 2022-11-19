import fetch from "node-fetch";

// Package API(s) of one user of Codeforces
// Usage:
// const user = new CodeforcesUser("wushenghao")
// const res1 = await user.getSubmissionList(2, 10) from 2 to 11
// const res2 = await user.getSubmissionList(5)     from 5 to end
// const res3 = await user.getSubmissionList(5)     get all
export default class CodeforcesUser {
  constructor(handle) {
    this.handle = handle;
  }

  async getSubmissionList(from = 1, count) {
    const url = `https://codeforces.com/api/user.status?handle=${this.handle}&from=${from}`;
    if (arguments.length >= 2) {
      url += `&count=${count}`;
    }

    const response = await fetch(url);
    const result = await response.json();
    if (result.status !== "OK") {
      throw new Error(`Codeforces ${result.comment}`);
    }
    return await result.result;
  }
}
