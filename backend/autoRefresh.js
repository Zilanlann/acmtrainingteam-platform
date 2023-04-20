import { scheduleJob } from "node-schedule";
import { refreshCodeforces, refreshLeetcode, refreshUserDailyStatus, refreshCodeforcesAvatar, refreshLeetcodeAvatar } from "./refresh.js";

scheduleJob("35 * * * *", () => {
  refreshCodeforces();
  refreshLeetcode();
});

scheduleJob("45 * * * *", () => {
  refreshUserDailyStatus();
});

scheduleJob("40 12 * * *", () => {
  refreshLeetcodeAvatar();
  refreshCodeforcesAvatar();
});

// refreshCodeforces();
// refreshLeetcode();
// refreshLeetcodeAvatar();
// refreshCodeforcesAvatar();
// refreshUserDailyStatus();
