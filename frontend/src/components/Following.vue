<template>
  <el-container style="height: 100%; width: 100%">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column label="User" align="center">
        <template #default="scope">
          <el-link @click="this.$router.push(`/user/${scope.row.user_name}`)">
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
    <el-footer height="0"> </el-footer>
  </el-container>
</template>

<script>
import { post } from "@/logic/dataGetting";
import { getRatingColor } from "@/logic/dataShowing";
export default {
  data() {
    return {
      tableData: [],
    };
  },
  methods: {
    getRatingColor,
  },
  async created() {
    post(
      "/api/ranking/following",
      {
        userId: this.$cookies.get("token")?.id,
      },
      (result) => {
        this.tableData = result;
      }
    );
  },
};
</script>
<style scoped>
.first-letter-black::first-letter {
  color: #000000 !important;
}
</style>
