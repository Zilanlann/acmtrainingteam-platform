import moment from "moment";
function getStatusColor(status) {
  switch (status) {
    case "Accepted":
      return "success";
    case "Wrong Answer":
    case "Time Limit Exceeded":
      return "danger";
    case "Testing":
      return "primary";
    default:
      return "warning";
  }
}
function getRatingColor(rating) {
  let color;
  if (rating < 1200) {
    color = "#808080";
  } else if (rating >= 1200 && rating < 1400) {
    color = "#008000";
  } else if (rating >= 1400 && rating < 1600) {
    color = "#03a89e";
  } else if (rating >= 1600 && rating < 1900) {
    color = "#0000ff";
  } else if (rating >= 1900 && rating < 2100) {
    color = "#aa00aa";
  } else if (rating >= 2100 && rating < 2400) {
    color = "#ff8c00";
  } else if (rating >= 2400) {
    color = "#ff0000";
  }
  return color;
}
function getFromNowTime(timestamp) {
  const nowMoment = moment();
  const submitMoment = moment.unix(timestamp);
  const units = ["year", "month", "week", "day", "hour", "minute", "second"];
  for (const unit of units) {
    const unitDiffTime = nowMoment.diff(submitMoment, unit);
    if (unitDiffTime) {
      return `${unitDiffTime} ${unit}${unitDiffTime > 1 ? "s" : ""} ago`;
    }
  }
  return "Now";
}
function getProblemUrl(row) {
  if (row.title_slug) {
    return `https://leetcode.cn/problems/${row.title_slug}`;
  }
  const [contestId, index] = row.codeforces_problem_id.split("/");
  if (contestId.length >= 6) {
    return `https://codeforces.com/gym/${contestId}/problem/${index}`;
  }
  return `https://codeforces.com/problemset/problem/${row.codeforces_problem_id}`;
}
function getSubmissionUrl(row) {
  if (row.title_slug) {
    return `https://leetcode.cn/submissions/detail/${row.submission_id}`;
  }
  const contestId = row.codeforces_problem_id.split("/")[0];
  if (contestId.length >= 6) {
    return `https://codeforces.com/gym/${contestId}/submission/${row.submission_id}`;
  }
  return `https://codeforces.com/contest/${contestId}/submission/${row.submission_id}`;
}
export {
  getStatusColor,
  getFromNowTime,
  getRatingColor,
  getProblemUrl,
  getSubmissionUrl,
};
