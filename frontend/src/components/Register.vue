<template>
  <el-card style="width: 460px; margin: 20px auto; padding: 0 30px">
    <el-row justify="center" style="margin: 14px"> Register </el-row>
    <el-form
      ref="formRef"
      label-position="right"
      label-width="80px"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="Username" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="form.password" show-password />
      </el-form-item>
      <el-form-item label="Confirm" prop="confirm">
        <el-input v-model="form.confirm" show-password />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="QQ" prop="qq">
        <el-input v-model="form.qq" />
      </el-form-item>
      <el-form-item label="About" prop="about">
        <el-input
          v-model="form.about"
          type="textarea"
          placeholder="Describe yourself in one sentence"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">Register</el-button>
        <el-button
          style="margin-left: 30px"
          @click="this.$router.push(`/signin`)"
          >Cancel</el-button
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
        name: "",
        password: "",
        confirm: "",
        email: "",
        qq: "",
        about: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "Please input your username",
            trigger: "blur",
          },
          {
            min: 3,
            max: 12,
            message: "Length should be 3 to 12",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please input your password",
            trigger: "blur",
          },
          {
            min: 6,
            max: 64,
            message: "Length should be 6 to 64",
            trigger: "blur",
          },
          {
            pattern: /^.*(?=.*\d)(?=.*[A-Za-z]).*$/,
            trigger: "blur",
            message: "Should include letter and number",
          },
        ],
        confirm: [
          {
            required: true,
            message: "Please enter your password again",
            trigger: "blur",
          },
          { validator: this.validateConfirm, trigger: "blur" },
        ],
        email: [
          {
            required: true,
            message: "Please input email address",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Please input correct email address",
            trigger: ["blur", "change"],
          },
        ],
        qq: [
          {
            pattern: /^.*(?=.{5,12})(?=.*\d).*$/,
            message: "Please input correct QQ",
            trigger: ["blur", "change"],
          },
        ],
        about: [
          {
            max: 100,
            message: "Length should be lower than 100",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submit() {
      const formEl = this.$refs.formRef;
      if (!formEl) return;
      formEl.validate(async (valid) => {
        if (valid) {
          const reqBody = {
            name: this.form.name,
            password: this.form.password,
            email: this.form.email,
            qq: this.form.qq,
            about: this.form.about,
          };
          const res = await this.$http.post("/api/user/register", reqBody);
          if (res.data.ok) {
            this.$message.success("Register successfully.");
            this.$router.push(`/signin`);
          } else if (res.data?.err?.sqlMessage) {
            if (res.data.err.sqlMessage.indexOf("user.user_name_uindex") !== -1)
              this.$message.error(
                `The username ${reqBody.name} has registered by others.`
              );
            else {
              this.$message.error(
                `The email ${reqBody.email} has registered by others. 
								If it was not your operation, please contact the administrator.`
              );
            }
          } else {
            this.$message.error("Fail to register, backend has some problem.");
          }
        } else {
          this.$message.error(
            "Fail to register, please check your information."
          );
        }
      });
    },
    validateConfirm(rule, value, callback) {
      if (value === this.form.password) {
        callback();
      } else {
        callback(new Error("Two passwords do not match"));
      }
    },
  },
};
</script>
