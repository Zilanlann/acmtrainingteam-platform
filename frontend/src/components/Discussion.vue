<template>
  <el-container style="height: 100%; width: 100%">
    <el-header>
      <el-page-header @back="this.$router.back()">
        <template #content>
          <span class="text-large font-600 mr-3">
            <span>Recent discussions</span>
          </span>
        </template>
      </el-page-header>
      <div style="float: right; margin-top: -24px">
        <el-input
          v-model="search"
          :placeholder="`Search Problem`"
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
      title="Filter of problems"
      style="margin-top: 30px"
    >
      <el-checkbox-group v-model="filterOptions" style="margin-top: -10px">
        <el-checkbox-button
          v-for="option in ['Platform', 'Tags', 'Rating']"
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
    <el-table
      @sort-change="sortChange"
      :data="tableData"
      stripe
      style="width: 100%"
    >
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
      <el-table-column
        prop="title"
        sortable="custom"
        label="Problem"
        align="center"
      >
        <template #default="scope">
          <el-link
            type="primary"
            :href="getProblemUrl(scope.row)"
            target="_blank"
            >{{ scope.row.title ? scope.row.title : "No Title" }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column
        label="Rating"
        align="center"
        prop="rating"
        sortable="custom"
      >
        <template #default="scope">
          <span :style="`color: ${getRatingColor(scope.row.rating)}`">
            <div :class="scope.row.rating >= 3000 ? `first-letter-black` : ``">
              {{ scope.row.rating ? scope.row.rating : "No rating" }}
            </div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Tags" align="center">
        <template #default="scope">
          <el-link
            v-for="item of scope.row.tags.split(',')"
            :key="item"
            :underline="false"
          >
            <el-tag @click="addTag(item)" style="margin: 0 2px" size="small">
              {{ item }}
            </el-tag>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="floor_number"
        sortable="custom"
        label="Floors"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="user_name"
        sortable="custom"
        label="Last Post"
        align="center"
      >
        <template #default="scope">
          <el-link
            :underline="false"
            @click="this.$router.push(`/user/${scope.row.user_name}`)"
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

      <el-table-column
        prop="time"
        sortable="custom"
        label="Time"
        align="center"
      >
        <template #default="scope">
          {{ getFromNowTime(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="Discussion" align="center">
        <template #default="scope">
          <el-button
            @click="this.$router.push(`/discussion/${scope.row.problem_id}`)"
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
  getProblemUrl,
  getLeetcodeAvatar,
  getCodeforcesAvatar,
  getFromNowTime,
} from "@/logic/dataShowing";
import { post } from "@/logic/dataGetting";
import moment from "moment";

export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      filterOptions: [],
      filter: {
        rating: [800, 3500],
        platform: [],
        tags: [],
      },
      search: "",
      requestBody: {
        page: 1,
        filter: {},
      },
      tagList: [],
    };
  },
  methods: {
    getLeetcodeAvatar,
    getCodeforcesAvatar,
    getRatingColor,
    getProblemUrl,
    getTableData() {
      post("/api/post/recent", this.requestBody, (result) => {
        this.tableData = result;
      });
    },
    onSearch() {
      this.requestBody.search = this.search;
    },
    submitFilter() {
      this.requestBody.filter = this.filterOptions.reduce((obj, item) => {
        obj[item.toLowerCase()] = this.filter[item.toLowerCase()];
        return obj;
      }, {});
      this.dialogVisible = false;
    },
    addTag(tag) {
      if (!this.filter.tags.includes(tag)) {
        this.filter.tags.push(tag);
      }
      if (!this.filterOptions.includes("Tags")) {
        this.filterOptions.push("Tags");
      }
      if (!this.requestBody.filter?.tags) {
        this.requestBody.filter.tags = [];
      }
      if (!this.requestBody.filter.tags.includes(tag)) {
        this.requestBody.filter.tags.push(tag);
      }
      this.getTableData();
    },
    sortChange({ prop, order }) {
      this.requestBody.order = {
        prop,
        order,
      };
    },
    getFromNowTime(time) {
      return getFromNowTime(moment(time).unix());
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
    if (this.$route.params.tag) {
      this.addTag(this.$route.params.tag);
    }
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
