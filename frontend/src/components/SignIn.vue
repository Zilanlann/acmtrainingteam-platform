<template>
  <el-card
    style="height: 250px; width: 300px; margin: 10% auto; padding: 0 30px"
  >
    <el-row justify="center" style="margin: 14px"> Sign In </el-row>
    <el-form :model="form" :rules="rules">
      <el-form-item prop="usernameOrEmail">
        <el-input
          @keyup.enter="onSubmit"
          v-model="form.usernameOrEmail"
          placeholder="Username or email"
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
export default {
  data() {
    return {
      form: {
        usernameOrEmail: "",
        password: "",
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
      const isEmailReg =
        /^[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/;
      const reqBody = {
        type: isEmailReg.test(this.form.usernameOrEmail) ? "email" : "name",
        usernameOrEmail: this.form.usernameOrEmail,
        password: this.form.password,
      };
      try {
        const res = await this.$http.post("/api/user/signin", reqBody);
        if (res.data.ok === true) {
          this.$cookies.set("token", res.data.token);
          this.$emit("refreshUser");
          this.$message.success({
            message: "You have signed in successfully.",
            duration: 1000,
          });
          this.$router.push("/ranking");
          this.$emit("refreshMenu");
        } else {
          this.$message.error(res.data.message);
        }
      } catch (err) {
        console.error(err);
        this.$message.error(err);
      }
    },
  },
};
</script>
