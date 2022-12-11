<template>
  <el-container style="height: 100%; width: 100%" direction="vertical">
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      :default-sort="{ prop: 'active_score', order: 'descending' }"
      @filter-change="filterChange"
      @sort-change="sortChange"
    >
      <el-table-column
        label="User"
        align="center"
        prop="name"
        sortable="custom"
        :filters="[
          { text: 'Following', value: 'Following' },
          { text: 'Unfollowing', value: 'Unfollowing' },
        ]"
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
        <el-table-column
          prop="week_ac_submission_number"
          sortable="custom"
          label="Accepted / All"
          align="center"
        >
          <template #default="scope">
            {{ scope.row.week_ac_submission_number }} /
            {{ scope.row.week_submission_number }}
          </template>
        </el-table-column>
        <el-table-column
          prop="week_average_ac_rating"
          sortable="custom"
          label="Average rating"
          align="center"
        >
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
        <el-table-column
          prop="month_ac_submission_number"
          sortable="custom"
          label="Accepted / All"
          align="center"
        >
          <template #default="scope">
            {{ scope.row.month_ac_submission_number }} /
            {{ scope.row.month_submission_number }}
          </template>
        </el-table-column>
        <el-table-column
          prop="month_average_ac_rating"
          sortable="custom"
          label="Average rating"
          align="center"
        >
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
      <el-table-column
        prop="active_score"
        sortable="custom"
        label="Active Score"
        align="center"
      >
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
    <el-pagination
      style="margin: 0 auto"
      v-model:current-page="page"
      :page-size="15"
      :pager-count="11"
      layout="prev, pager, next"
      :total="150"
    />
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
      page: 1,
      tableData: [],
      following: [],
      filter: [],
      order: {
        prop: "active_score",
        order: "descending",
      },
    };
  },
  methods: {
    getLeetcodeAvatar,
    getCodeforcesAvatar,
    getRatingColor,
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
    filterChange(filters) {
      this.filter = Object.values(filters)[0];
      this.getRanking();
    },
    sortChange({ prop, order }) {
      this.order = {
        prop,
        order,
      };
      this.getRanking();
    },
    getRanking() {
      post(
        "/api/ranking",
        {
          page: this.page,
          filter: this.filter,
          user_id: this.$cookies.get("token")?.id,
          order: this.order,
        },
        (result) => {
          this.tableData = result;
        }
      );
    },
    getFollowingList() {
      if (this.$cookies.get("token")?.id) {
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
      }
    },
  },
  watch: {
    page() {
      this.getRanking();
    },
  },
  async created() {
    this.getRanking();
    this.getFollowingList();
  },
};
</script>
<style scoped>
.first-letter-black::first-letter {
  color: #000000 !important;
}
</style>
