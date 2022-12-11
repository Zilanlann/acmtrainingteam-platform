<template>
  <el-container style="height: 100%">
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      @sort-change="sortChange"
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
        sortable="custom"
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
        sortable="custom"
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
      <el-table-column width="150px" align="center">
        <template #default="scope">
          <el-button
            size="small"
            type="danger"
            @click="onDelete(scope.row.follow_id)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-footer height="60px" style="padding: 10px">
      <el-form
        :inline="true"
        :model="followingToAdd"
        :rules="rules"
        ref="formRef"
        style="text-align: center"
      >
        <el-form-item label="User" prop="user_id">
          <el-select-v2
            v-model="followingToAdd.user_id"
            filterable
            :options="userList"
            placeholder="Please select user"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Add</el-button>
        </el-form-item>
      </el-form>
    </el-footer>
  </el-container>
</template>
<script>
import { post } from "@/logic/dataGetting";
import { getLeetcodeAvatar, getCodeforcesAvatar } from "@/logic/dataShowing";

export default {
  data() {
    return {
      followingToAdd: {
        user_id: "",
      },
      tableData: [],
      userList: [],
      rules: {
        user_id: [
          {
            required: true,
            message: "Please select user",
            trigger: "blur",
          },
        ],
      },
      order: {
        prop: "",
        order: "",
      },
    };
  },
  methods: {
    getLeetcodeAvatar,
    getCodeforcesAvatar,
    getFollowingList() {
      post(
        "/api/following/list",
        {
          user_id: this.$cookies.get("token")?.id,
          order: this.order,
        },
        (result) => {
          this.tableData = result;
        }
      );
    },
    getUserList() {
      post(
        "/api/following/userlisttofollow",
        {
          user_id: this.$cookies.get("token")?.id,
        },
        (result) => {
          this.userList = result.map((item) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
        }
      );
    },
    sortChange({ prop, order }) {
      this.order = {
        prop,
        order,
      };
      this.getFollowingList();
    },
    onSubmit() {
      const formEl = this.$refs.formRef;
      if (!formEl) return;
      formEl.validate(async (valid) => {
        if (valid) {
          await post(
            "/api/following/add",
            {
              user_id: this.$cookies.get("token")?.id,
              follow_id: this.followingToAdd.user_id,
            },
            (result) => {
              this.$message.success({
                message: result,
                duration: 1000,
              });
              this.followingToAdd = {
                user_id: "",
              };
            }
          );
          this.getUserList();
          this.getFollowingList();
        }
      });
    },
    async onDelete(followId) {
      await post(
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
        }
      );
      this.getUserList();
      this.getFollowingList();
    },
  },
  async created() {
    if (!this.$cookies.get("token")?.id) {
      return;
    }
    this.getUserList();
    this.getFollowingList();
  },
};
</script>
