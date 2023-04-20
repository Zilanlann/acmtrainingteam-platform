<template>
  <el-container style="height: 100%">
    <el-header>
      <el-page-header @back="this.$router.back()">
        <template #content>
          <span class="text-large font-600 mr-3">
            <span> List {{ $route.params.listName }}</span>
          </span>
        </template>
      </el-page-header>
    </el-header>
    <el-divider style="margin: 0" />
    <el-table :data="tableData" stripe style="width: 100%">
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
      <el-table-column label="Operation" width="150px" align="center">
        <template #default="scope">
          <el-button
            size="small"
            type="danger"
            @click="onDelete(scope.row.user_id)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-footer height="60px" style="padding: 10px">
      <el-form
        :inline="true"
        :model="userToAdd"
        :rules="rules"
        ref="formRef"
        style="text-align: center"
      >
        <el-form-item label="User" prop="user_id">
          <el-select-v2
            v-model="userToAdd.user_id"
            filterable
            :options="userList"
            placeholder="Please select user"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Add</el-button>
          <el-button type="primary" @click="openDialog">Batch manage</el-button>
        </el-form-item>
      </el-form>
    </el-footer>
    <el-dialog
      :title="`List ${$route.params.listName}`"
      v-model="dialogVisible"
      fullscreen
    >
      <el-checkbox-group v-model="checkList">
        <span v-for="user of allUsers" :key="user.name">
          <el-checkbox style="margin: 8px" :label="user.id">
            <el-avatar
              :size="24"
              :src="
                user.codeforces_avatar
                  ? getCodeforcesAvatar(user)
                  : getLeetcodeAvatar(user)
              "
              style="margin-right: 6px"
            />{{ user.name }}</el-checkbox
          >
        </span>
      </el-checkbox-group>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmDialog"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>
<script>
import { post } from "@/logic/dataGetting";
import { getLeetcodeAvatar, getCodeforcesAvatar } from "@/logic/dataShowing";

export default {
  data() {
    return {
      dialogVisible: false,
      userToAdd: {
        user_id: "",
      },
      tableData: [],
      userList: [],
      allUsers: [],
      checkList: [],
      rules: {
        user_id: [
          {
            required: true,
            message: "Please select user",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    getLeetcodeAvatar,
    getCodeforcesAvatar,
    getTableData() {
      post(
        "/api/list/getuser",
        {
          list_id: this.$route.params.listId,
        },
        (result) => {
          this.tableData = result;
          this.checkList = result.map((item) => item.user_id);
        }
      );
    },
    getUserList() {
      post(
        "/api/list/usertoadd",
        {
          list_id: this.$route.params.listId,
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
      post("/api/user/getall", null, (result) => {
        this.allUsers = result;
      });
    },
    onSubmit() {
      const formEl = this.$refs.formRef;
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          post(
            "/api/list/adduser",
            {
              list_id: this.$route.params.listId,
              user_id: this.userToAdd.user_id,
            },
            (result) => {
              this.$message.success({
                message: result,
                duration: 1000,
              });
              this.userToAdd = {
                user_id: "",
              };
              this.getUserList();
              this.getTableData();
            }
          );
        }
      });
    },
    async onDelete(userId) {
      await post(
        "/api/list/deleteuser",
        {
          list_id: this.$route.params.listId,
          user_id: userId,
        },
        (result) => {
          this.$message.success({
            message: result,
            duration: 1000,
          });
        }
      );
      this.getUserList();
      this.getTableData();
    },
    openDialog() {
      this.dialogVisible = true;
    },
    confirmDialog() {
      post(
        "/api/list/manage",
        {
          list_id: this.$route.params.listId,
          users: this.checkList,
        },
        (result) => {
          this.$message.success({
            message: result,
            duration: 1000,
          });
          this.getUserList();
          this.getTableData();
          this.dialogVisible = false;
        }
      );
    },
  },
  async created() {
    if (!this.$cookies.get("token")?.id) {
      return;
    }
    this.getUserList();
    this.getTableData();
  },
};
</script>
