<template>
  <el-container style="height: 100%; padding: 20px">
    <el-header style="line-height: 40px">
      Use json array to batch import accounts!
      <el-button
        style="float: right; margin-left: 20px"
        size="large"
        @click="textarea = ''"
        >Clear<el-icon class="el-icon--right"><Close /></el-icon
      ></el-button>
      <el-button
        type="primary"
        style="float: right"
        size="large"
        @click="onSubmit"
        >Import<el-icon class="el-icon--right"><Download /></el-icon></el-button
    ></el-header>
    <el-divider style="margin: 0" />
    <el-input
      style="padding: 20px; width: 800px"
      type="textarea"
      :autosize="{ minRows: 10, maxRows: 15 }"
      v-model="textarea"
    >
    </el-input>
  </el-container>
</template>
<script>
import { post } from "@/logic/dataGetting";

export default {
  data() {
    return {
      textarea: `[
	{
		"name": "wushenghao",
		"password": "123456",
		"codeforces_handle": "wushenghao",
		"leetcode_handle": "shenghaowu"
	},
	{
		"name": "xdy",
		"password": "123456",
		"codeforces_handle": "dyf3244"
	}
]`,
      data: "",
    };
  },
  methods: {
    onSubmit() {
      let data;
      try {
        data = JSON.parse(this.textarea);
      } catch (error) {
        this.$message.error(error.toString());
        console.error(error);
        return;
      }
      post(
        "/api/user/import",
        {
          auth: this.$cookies.get("token"),
          data,
        },
        (result) => {
          this.$alert(result);
        }
      );
    },
  },
};
</script>
