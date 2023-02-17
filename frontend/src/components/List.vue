<template>
  <el-container style="height: 100%">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column label="List" align="center" prop="list_name" sortable>
      </el-table-column>
      <el-table-column label="Operation" align="center">
        <template #default="scope">
          <el-button
            type="info"
            @click="
              this.$router.push(`/list/${scope.row.id}/${scope.row.list_name}`)
            "
            >Details</el-button
          >
          <el-popconfirm
            confirm-button-text="Yes"
            cancel-button-text="No"
            :icon="InfoFilled"
            title="Sure to delete?"
            @confirm="onDelete(scope.row.id)"
          >
            <template #reference>
              <el-button type="danger">Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-footer height="60px" style="padding: 10px">
      <el-form :inline="true" style="text-align: center">
        <el-form-item label="List Name" prop="user_id">
          <el-input v-model="listToAdd" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAdd">Add</el-button>
        </el-form-item>
      </el-form>
    </el-footer>
  </el-container>
</template>
<script>
import { post } from "@/logic/dataGetting";

export default {
  data() {
    return {
      listToAdd: "",
      tableData: [],
    };
  },
  methods: {
    getList() {
      post(
        "/api/list/getlist",
        {
          user_id: this.$cookies.get("token")?.id,
          order: this.order,
        },
        (result) => {
          this.tableData = result;
        }
      );
    },
    onAdd() {
      if (!this.listToAdd) {
        this.$message.error("Please enter list name.");
        return;
      }
      if (this.listToAdd.length > 12) {
        this.$message.error("The name of list is too long.");
        return;
      }
      post(
        "/api/list/addlist",
        {
          user_id: this.$cookies.get("token")?.id,
          list_name: this.listToAdd,
        },
        (result) => {
          this.$message.success({
            message: result,
            duration: 1000,
          });
          this.getList();
          this.listToAdd = "";
        }
      );
    },
    onDelete(listId) {
      post(
        "/api/list/deletelist",
        {
          list_id: listId,
        },
        (result) => {
          this.$message.success({
            message: result,
            duration: 1000,
          });
          this.getList();
        }
      );
    },
  },
  async created() {
    if (!this.$cookies.get("token")?.id) {
      return;
    }
    this.getList();
  },
};
</script>
