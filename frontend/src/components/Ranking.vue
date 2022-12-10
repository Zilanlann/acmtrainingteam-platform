<template>
  <el-container style="height: 100%; width: 100%" direction="vertical">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
        label="User"
        align="center"
        :filters="[
          { text: 'Following', value: true },
          { text: 'Unfollowing', value: false },
        ]"
        :filter-method="filterUser"
      >
        <template #default="scope">
          <el-button
            link
            v-if="!following.includes(scope.row.user_id)"
            style="float: left; margin-right: -8px; margin-top: 2px"
            @click="follow(scope.row.user_id)"
          >
            <el-icon :size="18"><Star /> </el-icon>
          </el-button>
          <el-button
            v-else
            link
            style="float: left; margin-left: -2px; margin-right: -10px"
            @click="unfollow(scope.row.user_id)"
          >
            <el-icon color="#ffab00" :size="22"><StarFilled /> </el-icon>
          </el-button>
          <el-link
            @click="this.$router.push(`/user/${scope.row.user_name}`)"
            :underline="false"
          >
            <el-avatar
              :size="28"
              :src="
                scope.row.codeforces_avatar
                  ? getCodeforcesAvatar(scope.row)
                  : getLeetcodeAvatar(scope.row)
              "
              style="margin-right: 6px"
            />
            {{ scope.row.user_name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="Week" align="center">
        <el-table-column label="Accepted / All" align="center">
          <template #default="scope">
            {{ scope.row.week_ac_submission_number }} /
            {{ scope.row.week_submission_number }}
          </template>
        </el-table-column>
        <el-table-column label="Average rating" align="center">
          <template #default="scope">
            <span
              :style="`color: ${getRatingColor(
                scope.row.week_average_ac_rating
              )}`"
            >
              <div
                :class="
                  scope.row.week_average_ac_rating >= 3000
                    ? `first-letter-black`
                    : ``
                "
              >
                {{
                  scope.row.week_average_ac_rating
                    ? parseInt(scope.row.week_average_ac_rating)
                    : null
                }}
              </div>
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Month" align="center">
        <el-table-column label="Accepted / All" align="center">
          <template #default="scope">
            {{ scope.row.month_ac_submission_number }} /
            {{ scope.row.month_submission_number }}
          </template>
        </el-table-column>
        <el-table-column label="Average rating" align="center">
          <template #default="scope">
            <span
              :style="`color: ${getRatingColor(
                scope.row.month_average_ac_rating
              )}`"
            >
              <div
                :class="
                  scope.row.month_average_ac_rating >= 3000
                    ? `first-letter-black`
                    : ``
                "
              >
                {{
                  scope.row.month_average_ac_rating
                    ? parseInt(scope.row.month_average_ac_rating)
                    : null
                }}
              </div>
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="Active Score" align="center">
        <template #default="scope">
          <span :style="`color: ${getRatingColor(scope.row.active_score)}`">
            <div
              :class="
                scope.row.active_score >= 3000 ? `first-letter-black` : ``
              "
            >
              {{
                scope.row.active_score ? parseInt(scope.row.active_score) : null
              }}
            </div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Submissions" align="center">
        <template #default="scope">
          <el-button
            @click="
              this.$router.push(`/submissions/user/${scope.row.user_name}`)
            "
            type="info"
            plain
            size="small"
            >Details</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>

<script>
import { post } from "@/logic/dataGetting";
import {
  getRatingColor,
  getLeetcodeAvatar,
  getCodeforcesAvatar,
} from "@/logic/dataShowing";
export default {
  data() {
    return {
      tableData: [],
      following: [],
    };
  },
  methods: {
    getLeetcodeAvatar,
    getCodeforcesAvatar,
    getRatingColor,
    filterUser(value, row) {
      return this.following.includes(row.user_id) === value;
    },
    getFollowingList() {
      post(
        "/api/following/list",
        {
          user_id: this.$cookies.get("token")?.id,
        },
        (result) => {
          this.following = result.map((item) => {
            return item.follow_id;
          });
        }
      );
    },
    unfollow(followId) {
      if (!this.$cookies.get("token")?.id) {
        this.$message.error("Please sign in first!");
        return;
      }
      post(
        "/api/following/delete",
        {
          user_id: this.$cookies.get("token")?.id,
          follow_id: followId,
        },
        (result) => {
          this.$message.success({
            message: result,
            duration: 1000,
          });
          this.getFollowingList();
        }
      );
    },
    follow(followId) {
      if (!this.$cookies.get("token")?.id) {
        this.$message.error("Please sign in first!");
        return;
      }
      post(
        "/api/following/add",
        {
          user_id: this.$cookies.get("token")?.id,
          follow_id: followId,
        },
        (result) => {
          this.$message.success({
            message: result,
            duration: 1000,
          });
          this.getFollowingList();
        }
      );
    },
  },
  async created() {
    post("/api/ranking", null, (result) => {
      this.tableData = result;
    });
    this.getFollowingList();
  },
};
</script>
<style scoped>
.first-letter-black::first-letter {
  color: #000000 !important;
}
</style>
