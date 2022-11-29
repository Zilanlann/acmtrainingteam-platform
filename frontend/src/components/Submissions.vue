<template>
  <el-container style="height: 100%">
    <el-header>
      <el-page-header @back="this.$router.back()">
        <template #content>
          <span class="text-large font-600 mr-3">
            <span v-if="$route.params.userName">
              {{ $route.params.userName }} 's submissions
            </span>
            <span v-if="$route.params.problemId">
              Submissions of problem:
              {{ tableData[0]?.title }}</span
            >
          </span>
        </template>
      </el-page-header>
    </el-header>
    <el-divider style="margin: 0" />
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column width="26px" style="padding: 0">
        <template #default="scope">
          <img
            v-if="scope.row.title_slug"
            src="../image/leetcode.png"
            alt="L"
            width="14"
            height="14"
          />
          <img
            v-else
            src="../image/codeforces.png"
            alt="C"
            width="14"
            height="14"
          />
        </template>
      </el-table-column>
      <el-table-column label="Problem" align="center">
        <template #default="scope">
          <el-link
            type="primary"
            :href="getProblemUrl(scope.row)"
            target="_blank"
            >{{ scope.row.title }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="User" align="center">
        <template #default="scope">
          <el-link @click="this.$router.push(`/user/${scope.row.user_name}`)">
            {{ scope.row.user_name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="Rating" align="center">
        <template #default="scope">
          <span :style="`color: ${getRatingColor(scope.row.rating)}`">
            <div :class="scope.row.rating >= 3000 ? `first-letter-black` : ``">
              {{ scope.row.rating }}
            </div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Status" align="center">
        <template #default="scope">
          <el-link
            :type="getStatusColor(scope.row.status)"
            :href="getSubmissionUrl(scope.row)"
            target="_blank"
            >{{ scope.row.status }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="Tags" align="center">
        <template #default="scope">
          <el-link
            v-for="item of scope.row.tags.split(',')"
            :key="item"
            :underline="false"
          >
            <el-tag
              @click="this.$router.push(`/problems/tag/${item}`)"
              style="margin: 0 2px"
              size="small"
            >
              {{ item }}
            </el-tag>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="Time" align="center">
        <template #default="scope">
          {{ getFromNowTime(scope.row.submit_time) }}
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-pagination
        style="margin: 0 auto"
        v-model:current-page="page"
        :page-size="15"
        :pager-count="11"
        layout="prev, pager, next"
        :total="itemNumber"
      />
    </el-row>
  </el-container>
</template>

<script>
import {
  getRatingColor,
  getFromNowTime,
  getStatusColor,
  getSubmissionUrl,
  getProblemUrl,
} from "@/logic/dataShowing";
import { getData } from "@/logic/dataGetting";
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      itemNumber: 1000,
      condition: {},
    };
  },
  methods: {
    getRatingColor,
    getFromNowTime,
    getStatusColor,
    getSubmissionUrl,
    getProblemUrl,
    initializeCondition() {
      if (this.$route.params.userName) {
        this.condition.user_name = this.$route.params.userName;
      } else if (this.$route.params.problemId) {
        this.condition.problem_id = this.$route.params.problemId;
      }
    },
  },
  watch: {
    page() {
      getData(
        "/api/submissions",
        {
          condition: this.condition,
          page: parseInt(this.page),
        },
        (resData) => {
          this.tableData = resData.result;
        }
      );
    },
  },
  async created() {
    this.initializeCondition();
    getData(
      "/api/submissions/number",
      {
        condition: this.condition,
      },
      (resData) => {
        this.itemNumber = resData.number;
      }
    );
    getData(
      "/api/submissions",
      {
        condition: this.condition,
        page: parseInt(this.page),
      },
      (resData) => {
        this.tableData = resData.result;
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
