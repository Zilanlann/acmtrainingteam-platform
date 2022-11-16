<template>
  <el-container style="border: 1px solid #eee">
    <el-form :model="form">
      <el-form-item>
        <el-input v-model="form.userName" placeholder="Username" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.passWord" placeholder="Password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Sign In</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script setup>
import { reactive } from "vue";

const form = reactive({
  userName: "",
  passWord: "",
});

const onSubmit = () => {
  console.log();
};
</script>
