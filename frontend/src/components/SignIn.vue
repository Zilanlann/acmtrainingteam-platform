<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="userName">
      <el-input v-model="form.userName" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

const form = reactive({
  userName: "",
  passWord: "",
});

const onSubmit = () => {
  console.log("submit!");
};
</script>
