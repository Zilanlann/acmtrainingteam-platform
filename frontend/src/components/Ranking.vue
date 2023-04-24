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
        :filters="lists"
      >
        <template #default="scope">
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
      <el-table-column prop="active_score" sortable="custom" align="center">
        <template #header>
          <el-tooltip placement="top" effect="light"
            ><template #content>
              For AC submissions in 30 days:
              <br />
              Sum(Rating * (Time - 30 days ago)) * k
            </template>
            Active Score</el-tooltip
          >
        </template>
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
      :page-sizes="[15, 30, 50, 100]"
      :page-size="size"
      :pager-count="11"
      layout="prev, pager, next, sizes"
      :page-count="10"
      @size-change="handleSizeChange"
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
      size: 30,
      tableData: [],
      filter: [],
      order: {
        prop: "active_score",
        order: "descending",
      },
      lists: [],
    };
  },
  methods: {
    getLeetcodeAvatar,
    getCodeforcesAvatar,
    getRatingColor,
    handleSizeChange(size) {
      this.size = size;
      this.getRanking();
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
          size: this.size,
          page: this.page,
          filter: this.filter,
          order: this.order,
        },
        (result) => {
          this.tableData = result;
        }
      );
      this.$cookies.set("order", this.order);
      this.$cookies.set("size", this.size);
      this.$cookies.set("page", this.page);
    },
    getList() {
      post(
        "/api/list/getlist",
        {
          user_id: this.$cookies.get("token")?.id,
        },
        (result) => {
          this.lists = result.map((item) => {
            return { text: item.list_name, value: item.id };
          });
        }
      );
    },
  },
  watch: {
    page() {
      this.getRanking();
    },
  },
  async created() {
    if (this.$cookies.get("token")?.id) {
      this.getList();
    }
    if (this.$cookies.get("order")) {
      this.order = this.$cookies.get("order");
    }
    if (this.$cookies.get("size")) {
      this.size = parseInt(this.$cookies.get("size"));
    }
    if (this.$cookies.get("page")) {
      this.page = parseInt(this.$cookies.get("page"));
    }
    this.getRanking();
  },
};
</script>
<style scoped>
.first-letter-black::first-letter {
  color: #000000 !important;
}
</style>
