<template>
  <el-container style="height: 100%">
    <el-container style="padding: 20px" v-if="!$cookies.get('token')?.id">
      To view page of setting, please sign in first.
    </el-container>
    <el-container v-else>
      <el-header height="49px" style="text-align: center; padding-left: 0">
        <el-radio-group v-model="settingOption" style="margin-top: 8px">
          <el-radio-button label="Information" />
          <el-radio-button label="Password" />
        </el-radio-group>
      </el-header>
      <el-divider style="margin: 0" />
      <el-container v-if="settingOption === 'Information'">
        <el-card
          style="
            height: 400px;
            width: 460px;
            margin: 20px auto;
            padding: 0 30px;
          "
        >
          <el-row justify="center" style="margin: 14px">
            Manage information of {{ userName }}
          </el-row>
          <el-form
            ref="informationFormRef"
            label-position="right"
            label-width="80px"
            :model="informationForm"
            :rules="informationFormRules"
          >
            <el-form-item label="Codeforces" prop="codeforces_handle">
              <el-input v-model="informationForm.codeforces_handle" />
            </el-form-item>
            <el-form-item label="LeetCode" prop="leetcode_handle">
              <el-input v-model="informationForm.leetcode_handle" />
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="informationForm.email" />
            </el-form-item>
            <el-form-item label="QQ" prop="qq">
              <el-input v-model="informationForm.qq" />
            </el-form-item>
            <el-form-item label="About" prop="about">
              <el-input
                v-model="informationForm.about"
                type="textarea"
                placeholder="Describe yourself in one sentence"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="margin-left: 90px"
                @click="onSubmit"
                >Submit</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-container>
      <el-container v-else>
        <el-card
          style="
            height: 220px;
            width: 460px;
            margin: 20px auto;
            padding: 0 30px;
          "
        >
          <el-row justify="center" style="margin: 14px">
            Change password of {{ userName }}
          </el-row>
          <el-form
            ref="passwordFormRef"
            label-position="right"
            label-width="80px"
            :model="passwordForm"
            :rules="passwordFormRules"
          >
            <el-form-item label="Password" prop="password">
              <el-input v-model="passwordForm.password" show-password />
            </el-form-item>
            <el-form-item label="Confirm" prop="confirm">
              <el-input v-model="passwordForm.confirm" show-password />
            </el-form-item>
            <el-form-item>
              <el-button
                style="margin-left: 90px"
                type="primary"
                @click="onSubmit"
                >Submit</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { post } from "@/logic/dataGetting";
export default {
  data() {
    return {
      settingOption: "Information",
      userName: "",
      informationForm: {},
      informationFormRules: {
        codeforces_handle: [
          {
            min: 3,
            max: 24,
            message: "Please input correct Codeforces handle",
            trigger: "blur",
          },
        ],
        leetcode_handle: [
          {
            min: 3,
            max: 30,
            message: "Please input correct LeetCode name",
            trigger: "blur",
          },
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
      passwordForm: {
        password: "",
        confirm: "",
      },
      passwordFormRules: {
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
      },
    };
  },
  methods: {
    onSubmit() {
      const formEl =
        this.settingOption === "Information"
          ? this.$refs.informationFormRef
          : this.$refs.passwordFormRef;
      if (!formEl) {
        return;
      }
      formEl.validate(async (valid) => {
        if (valid) {
          let reqBody;
          if (this.settingOption === "Information") {
            reqBody = {
              auth: this.$cookies.get("token"),
              info: {
                name: this.userName,
                email: this.informationForm.email,
                codeforces_handle: this.informationForm.codeforces_handle,
                leetcode_handle: this.informationForm.leetcode_handle,
                qq: this.informationForm.qq,
                about: this.informationForm.about,
              },
            };
          } else {
            reqBody = {
              auth: this.$cookies.get("token"),
              info: {
                name: this.userName,
                password: this.passwordForm.password,
              },
            };
          }
          post("/api/user/update", reqBody, (result) => {
            this.$message.success(result);
            if (this.settingOption === "Information") {
              this.$router.push(`/user/${this.userName}`);
            } else {
              this.$cookies.remove("token");
              this.$router.push("/signin");
            }
          });
        } else {
          this.$message.error("Unknown error.");
        }
      });
    },
    validateConfirm(rule, value, callback) {
      if (value === this.passwordForm.password) {
        callback();
      } else {
        callback(new Error("Two passwords do not match."));
      }
    },
  },
  created() {
    if (this.$route.params.userName) {
      this.userName = this.$route.params.userName;
    } else {
      this.userName = this.$cookies.get("token")?.name;
    }
    post(
      "/api/user/info",
      {
        user_name: this.userName,
      },
      (result) => {
        this.informationForm = result.user;
      }
    );
  },
};
</script>
