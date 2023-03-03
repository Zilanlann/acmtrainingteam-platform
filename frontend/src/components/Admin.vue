<template>
  <el-container style="height: 100%">
    <el-header height="0"> </el-header>
    <el-divider style="margin: 0" />
    <el-table
      :data="
        tableData.filter(
          (data) =>
            !search || data.name.toLowerCase().includes(search.toLowerCase())
        )
      "
      stripe
      style="width: 100%"
    >
      <el-table-column label="User" align="center">
        <template #default="scope">
          <el-link @click="this.$router.push(`/user/${scope.row.name}`)">
            {{ scope.row.name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="Codeforces"
        align="center"
        prop="codeforces_handle"
        sortable
      >
        <template #default="scope">
          <el-link
            type="primary"
            :href="`https://codeforces.com/profile/${scope.row.codeforces_handle}`"
            target="_blank"
            :underline="false"
          >
            <el-avatar
              v-show="scope.row.codeforces_avatar"
              :size="28"
              :src="getCodeforcesAvatar(scope.row)"
              style="margin-right: 6px"
            />
            {{ scope.row.codeforces_handle }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column
        label="LeetCode"
        align="center"
        prop="leetcode_handle"
        sortable
      >
        <template #default="scope">
          <el-link
            type="primary"
            :href="`https://leetcode.cn/u/${scope.row.leetcode_handle}/`"
            target="_blank"
            :underline="false"
          >
            <el-avatar
              v-show="scope.row.leetcode_avatar"
              :size="28"
              :src="getLeetcodeAvatar(scope.row)"
              style="margin-right: 6px"
            />{{ scope.row.leetcode_handle }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="Operation" width="180px" align="center">
        <template #header>
          <el-input
            v-model="search"
            size="small"
            placeholder="Type to search"
          />
        </template>
        <template #default="scope">
          <el-button
            type="info"
            size="small"
            @click="this.$router.push(`/settings/${scope.row.name}`)"
            >Edit</el-button
          >
          <el-popconfirm
            confirm-button-text="Yes"
            cancel-button-text="No"
            title="Sure to delete?"
            @confirm="onDelete(scope.row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small">Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>
<script>
import { post } from "@/logic/dataGetting";
import { getLeetcodeAvatar, getCodeforcesAvatar } from "@/logic/dataShowing";

export default {
  data() {
    return {
      search: "",
      tableData: [],
    };
  },
  methods: {
    getLeetcodeAvatar,
    getCodeforcesAvatar,
    getTableData() {
      post("/api/user/getall", null, (result) => {
        this.tableData = result;
      });
    },
    async onDelete(userId) {
      await post(
        "/api/user/delete",
        {
          auth: this.$cookies.get("token"),
          userId,
        },
        (result) => {
          this.$message.success({
            message: result,
            duration: 1000,
          });
        }
      );
      this.getTableData();
    },
  },
  async created() {
    if (!this.$cookies.get("token")?.id) {
      return;
    }
    this.getTableData();
  },
};
</script>
