<template>
  <el-card
    style="height: 300px; width: 300px; margin: 5% auto; padding: 0 30px"
  >
    <el-row justify="center" style="margin: 14px"> Sign In </el-row>
    <el-row justify="center" style="margin: 20px">
      <el-radio-group v-model="form.type">
        <el-radio-button label="Username" />
        <el-radio-button label="Email" />
      </el-radio-group>
    </el-row>
    <el-form :model="form" :rules="rules">
      <el-form-item prop="usernameOrEmail">
        <el-input
          @keyup.enter="onSubmit"
          v-model="form.usernameOrEmail"
          :placeholder="form.type"
          clearable
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          @keyup.enter="onSubmit"
          v-model="form.password"
          placeholder="Password"
          clearable
          show-password
        />
      </el-form-item>
      <el-button
        type="primary"
        style="font-size: small"
        link
        @click="this.$router.push(`/register`)"
        >Do not have account?
      </el-button>
      <el-form-item justify="center">
        <el-button style="margin: 10px 92px" type="primary" @click="onSubmit"
          >Sign In</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { post } from "@/logic/dataGetting";
export default {
  data() {
    return {
      form: {
        usernameOrEmail: "",
        password: "",
        type: "Username",
      },
      rules: {
        usernameOrEmail: [
          {
            required: true,
            message: "Please input username or email",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please input your password",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      if (!(this.form.usernameOrEmail && this.form.password)) {
        this.$message.error("Please enter complete sign-in information.");
        return;
      }
      const reqBody = {
        type: this.form.type === "Email" ? "email" : "name",
        usernameOrEmail: this.form.usernameOrEmail,
        password: this.form.password,
      };
      post("/api/user/signin", reqBody, (result) => {
        this.$cookies.set("token", result);
        this.$message.success({
          message: "You have signed in successfully.",
          duration: 1000,
        });
        this.$router.push("/ranking");
        this.$emit("refreshMenu");
        this.$emit("refreshUser");
      });
    },
  },
  created() {
    if (this.$cookies.get("token")) {
      this.$router.replace("/ranking");
    }
  },
};
</script>
