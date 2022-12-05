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
      <div style="float: right; margin-top: -24px">
        <el-input
          v-model="search"
          :placeholder="
            $route.params.userName ? `Search Problem` : `Search User`
          "
          style="width: 180px; margin-right: -35px"
          @keyup.enter="onSearch"
        />
        <el-button @click="onSearch" circle>
          <el-icon>
            <Search />
          </el-icon>
        </el-button>
        <el-button
          type="primary"
          @click="dialogVisible = true"
          style="margin-left: 20px"
          >Open Filter</el-button
        >
      </div>
    </el-header>
    <el-dialog
      v-model="dialogVisible"
      title="Filter of submissions"
      style="margin-top: 30px"
    >
      <el-checkbox-group v-model="filterOptions" style="margin-top: -10px">
        <el-checkbox-button
          v-for="option in ['Platform', 'Status', 'Tags', 'Time', 'Rating']"
          :key="option"
          :label="option"
        ></el-checkbox-button>
      </el-checkbox-group>
      <el-divider />
      <el-form
        :model="filter"
        label-position="right"
        label-width="80px"
        style="margin-bottom: -10px"
      >
        <el-form-item label="Platform">
          <el-radio-group
            v-model="filter.platform"
            :disabled="!filterOptions.includes('Platform')"
          >
            <el-radio-button label="Codeforces" />
            <el-radio-button label="LeetCode" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Status">
          <el-select-v2
            :disabled="!filterOptions.includes('Status')"
            v-model="filter.status"
            filterable
            :options="statusList"
            placeholder="Please select status"
            style="width: 340px"
            multiple
            collapse-tags
            collapse-tags-tooltip
          />
        </el-form-item>
        <el-form-item label="Tags">
          <el-select-v2
            :disabled="!filterOptions.includes('Tags')"
            v-model="filter.tags"
            filterable
            :options="tagList"
            placeholder="Please select tags"
            style="width: 340px"
            multiple
            collapse-tags
            collapse-tags-tooltip
          />
        </el-form-item>
        <el-form-item label="Time">
          <el-date-picker
            :disabled="!filterOptions.includes('Time')"
            placement="top"
            v-model="filter.time"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-form-item label="Rating">
          <el-slider
            :disabled="!filterOptions.includes('Rating')"
            v-model="filter.rating"
            range
            :min="800"
            :max="3500"
            :step="100"
            :marks="{
              800: '800',
              3500: '3500',
            }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitFilter"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
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
    <el-pagination
      style="margin: 0 auto"
      v-model:current-page="requestBody.page"
      :page-size="15"
      :pager-count="11"
      layout="prev, pager, next"
      :total="150"
    />
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
import { post } from "@/logic/dataGetting";
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      filterOptions: [],
      filter: {
        time: [],
        rating: [800, 3500],
        platform: [],
        status: [],
        tags: [],
      },
      search: "",
      requestBody: {
        condition: {},
        page: 1,
      },
      shortcuts: [
        {
          text: "Last week",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
          },
        },
        {
          text: "Last month",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
          },
        },
        {
          text: "Last 3 months",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            return [start, end];
          },
        },
        {
          text: "Last year",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            return [start, end];
          },
        },
      ],
      statusList: [
        "Accepted",
        "Wrong Answer",
        "Memory Limit Exceeded",
        "Time Limit Exceeded",
        "Runtime Error",
        "Compilation Error",
        "Skipped",
        "Presentation Error",
        "Failed",
        "Partial",
        "Idleness Limit Exceeded",
        "Security Violated",
        "Crashed",
        "Input Preparation Crashed",
        "Challenged",
        "Rejected",
        "Output Limit Exceeded",
        "Testing",
      ].map((item) => {
        return {
          value: item,
          label: item,
        };
      }),
      tagList: [],
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
        this.requestBody.condition.name = this.$route.params.userName;
      } else if (this.$route.params.problemId) {
        this.requestBody.condition["p.id"] = this.$route.params.problemId;
      }
    },
    submitFilter() {
      this.requestBody.filter = this.filterOptions.reduce((obj, item) => {
        obj[item.toLowerCase()] = this.filter[item.toLowerCase()];
        return obj;
      }, {});
      this.dialogVisible = false;
    },
    onSearch() {
      delete this.requestBody.filter;
      if (this.$route.params.userName) {
        this.requestBody.search = {
          problem: this.search,
        };
      } else {
        this.requestBody.search = {
          user: this.search,
        };
      }
    },
    getTableData() {
      post("/api/submissions", this.requestBody, (result) => {
        this.tableData = result;
      });
    },
  },
  watch: {
    requestBody: {
      handler() {
        this.getTableData();
      },
      deep: true,
    },
  },
  async created() {
    this.initializeCondition();
    this.getTableData();
    post("/api/tags", null, (result) => {
      this.tagList = result.map((item) => {
        return {
          value: item.tag,
          label: item.tag,
        };
      });
    });
  },
};
</script>
<style scoped>
.first-letter-black::first-letter {
  color: #000000 !important;
}
</style>
