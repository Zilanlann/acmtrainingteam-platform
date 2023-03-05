<template>
  <el-container style="height: 100%">
    <el-header height="0"> </el-header>
    <el-divider style="margin: 0" />
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column label="Action" prop="action" align="center">
      </el-table-column>
      <el-table-column label="Handle" align="center" prop="handle">
      </el-table-column>
      <el-table-column label="Error" align="center" prop="error">
      </el-table-column>
      <el-table-column label="Time" align="center" prop="create_time">
        <template #default="scope">
          {{ getLocaleTime(scope.row.create_time) }}
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
import { getLeetcodeAvatar, getCodeforcesAvatar } from "@/logic/dataShowing";
import moment from "moment";

export default {
  data() {
    return {
      page: 1,
      size: 15,
      tableData: [],
    };
  },
  methods: {
    getLeetcodeAvatar,
    getCodeforcesAvatar,
    handleSizeChange(size) {
      this.size = size;
      this.getTableData();
    },
    getTableData() {
      post(
        "/api/log",
        {
          page: this.page,
          size: this.size,
        },
        (result) => {
          this.tableData = result;
          console.log(result);
        }
      );
    },
    getLocaleTime(time) {
      return moment(time).format("Y/M/D HH:mm:ss");
    },
  },
  async created() {
    this.getTableData();
  },
  watch: {
    page() {
      this.getTableData();
    },
  },
};
</script>
