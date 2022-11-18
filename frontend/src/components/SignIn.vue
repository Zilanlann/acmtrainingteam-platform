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

<script>
export default {
  data() {
    return {
      form: {
        userName: "",
        passWord: "",
      },
    };
  },
  methods: {
    onSubmit() {
      this.$cookies.set("userId", this.form.userName);
      this.$emit("refreshCookie");
      this.$message.success("You have signed in successfully.");
      this.$router.push("/ranking");
      this.$emit("refreshMenu");
    },
  },
};
</script>
