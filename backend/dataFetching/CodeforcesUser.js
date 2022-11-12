import fetch from "node-fetch"

// Usage:
// const user = new CodeforcesUser("wushenghao")
// const res = await user.getSubmissionList()
export default class CodeforcesUser {
    constructor(handle) {
        this.handle = handle
    }

    async getSubmissionList(from = 1, count = 50) {
        const response = await fetch(`https://codeforces.com/api/user.status?handle=${this.handle}&from=${from}&count=${count}`)
        if (!response.ok) {
            throw new HTTPResponseError(response)
        }
        return await response.json()
    }
}

const user = new CodeforcesUser("wushenghao")
const res = await user.getSubmissionList()