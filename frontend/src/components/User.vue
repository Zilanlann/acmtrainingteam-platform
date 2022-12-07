<template>
  <el-container>
    <el-container style="padding: 20px" v-if="!$route.params.userName">
      To view page of your user, please sign in first.
    </el-container>
    <el-container v-else>
      <el-header>
        <el-page-header @back="this.$router.back()">
          <template #content>
            <span class="text-large font-600 mr-3">
              {{ $route.params.userName }} 's information
            </span>
          </template>
        </el-page-header>
      </el-header>
      <el-divider style="margin: 0" />
      <el-container
        style="width: 700px; margin: 10px auto"
        direction="vertical"
      >
        <el-card style="margin: 10px; text-align: center">
          <template #header>
            {{ $route.params.userName }}
            <el-divider direction="vertical" />
            {{ information.following.length }} Following
            <el-divider direction="vertical" />
            {{ information.followers.length }} Followers
          </template>
          <el-descriptions border :column="1">
            <el-descriptions-item>
              <template #label>
                <div>
                  <el-icon><Message /></el-icon>
                  Email
                </div>
              </template>
              {{ information.user.email }}
            </el-descriptions-item>
            <el-descriptions-item v-if="information.user.qq">
              <template #label>
                <div>
                  <img src="../image/qq.svg" alt="L" width="14" height="14" />
                  QQ
                </div>
              </template>
              {{ information.user.qq }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="information.user.codeforces_handle"
              min-width="130px"
            >
              <template #label>
                <img
                  src="../image/codeforces.png"
                  alt="L"
                  width="14"
                  height="14"
                />
                Codeforces
              </template>
              <el-link
                type="primary"
                :href="`https://codeforces.com/profile/${information.user.codeforces_handle}`"
                target="_blank"
                :underline="false"
              >
                <el-avatar
                  :size="28"
                  :src="getCodeforcesAvatar(information.user)"
                  style="margin-right: 6px"
                />
                {{ information.user.codeforces_handle }}</el-link
              >
            </el-descriptions-item>
            <el-descriptions-item v-if="information.user.leetcode_handle">
              <template #label>
                <img
                  src="../image/leetcode.png"
                  alt="L"
                  width="14"
                  height="14"
                />
                LeetCode
              </template>
              <el-link
                type="primary"
                :href="`https://codeforces.com/profile/${information.user.leetcode_handle}`"
                target="_blank"
                :underline="false"
              >
                <el-avatar
                  :size="28"
                  :src="getLeetcodeAvatar(information.user)"
                  style="margin-right: 6px"
                />
                {{ information.user.leetcode_handle }}</el-link
              >
            </el-descriptions-item>
            <el-descriptions-item v-if="information.user.about">
              <template #label>
                <el-icon><Postcard /></el-icon>
                About
              </template>
              {{ information.user.about }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card style="margin: 10px">
          <template #header>
            Recent accepted submissions
            <el-button
              style="float: right; margin-top: -4px"
              @click="
                this.$router.push(`/submissions/user/${$route.params.userName}`)
              "
              text
            >
              More
            </el-button>
          </template>
          <el-table :data="recentAcSubmissions" stripe style="width: 100%">
            <el-table-column width="26px" style="padding: 0">
              <template #default="scope">
                <img
                  v-if="scope.row.title_slug"
                  src="../image/leetcode.png"
                  alt="L"
                  width="14"
                  height="14"
                />
                <img
                  v-else
                  src="../image/codeforces.png"
                  alt="C"
                  width="14"
                  height="14"
                />
              </template>
            </el-table-column>
            <el-table-column label="Problem" align="center">
              <template #default="scope">
                <el-link
                  type="primary"
                  :href="getProblemUrl(scope.row)"
                  target="_blank"
                  >{{ scope.row.title }}</el-link
                >
              </template>
            </el-table-column>
            <el-table-column label="Rating" align="center">
              <template #default="scope">
                <span :style="`color: ${getRatingColor(scope.row.rating)}`">
                  <div
                    :class="
                      scope.row.rating >= 3000 ? `first-letter-black` : ``
                    "
                  >
                    {{ scope.row.rating }}
                  </div>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Tags" align="center">
              <template #default="scope">
                <el-link
                  v-for="item of scope.row.tags.split(',')"
                  :key="item"
                  :underline="false"
                >
                  <el-tag
                    @click="this.$router.push(`/problems/tag/${item}`)"
                    style="margin: 0 2px"
                    size="small"
                  >
                    {{ item }}
                  </el-tag>
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="Time" align="center">
              <template #default="scope">
                {{ getFromNowTime(scope.row.submit_time) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { post } from "@/logic/dataGetting";
import {
  getLeetcodeAvatar,
  getCodeforcesAvatar,
  getProblemUrl,
  getRatingColor,
  getFromNowTime,
} from "@/logic/dataShowing";

export default {
  data() {
    return {
      information: {
        user: {
          email: "",
          qq: "",
          about: "",
          codeforce_handle: "",
          codeforce_avatar: "",
          leetcode_handle: "",
          leetcode_avatar: "",
        },
        following: [],
        followers: [],
      },
      recentAcSubmissions: [],
    };
  },
  methods: {
    getLeetcodeAvatar,
    getCodeforcesAvatar,
    getProblemUrl,
    getRatingColor,
    getFromNowTime,
  },
  created() {
    post(
      "/api/user/info",
      {
        user_name: this.$route.params.userName,
      },
      (result) => {
        this.information = result;
      }
    );
    post(
      "/api/submissions",
      {
        condition: {
          name: this.$route.params.userName,
        },
        page: 1,
        filter: {
          status: ["Accepted"],
        },
      },
      (result) => {
        this.recentAcSubmissions = result;
      }
    );
  },
};
</script>
