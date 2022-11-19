<template>
  <div
    style="
      height: 130px;
      width: 300px;
      margin: 10% auto;
      padding: 30px;
      border: 2px solid #eee;
    "
  >
    <el-form :model="form">
      <el-form-item>
        <el-input
          v-model="form.usernameOrEmail"
          placeholder="Username or email"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="form.password"
          placeholder="Password"
          clearable
          show-password
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Sign In</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        usernameOrEmail: "",
        password: "",
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
