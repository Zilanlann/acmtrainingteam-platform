<template>
  <el-container>
    <el-container v-if="!$route.params.userName" style="padding: 20px">
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
        style="width: 780px; margin: 10px auto"
        direction="vertical"
      >
        <el-card style="margin: 10px; text-align: center">
          <template #header>
            {{ $route.params.userName }}
            <el-divider direction="vertical" />
            <el-button link size="large" @click="followingDialogVisible = true"
              >{{ information.following.length }} Following</el-button
            >
            <el-divider direction="vertical" />
            <el-button link size="large" @click="followersDialogVisible = true"
              >{{ information.followers.length }} Followers</el-button
            >
          </template>
          <el-descriptions border :column="1">
            <el-descriptions-item>
              <template #label>
                <el-icon><Message /></el-icon>
                Email
              </template>
              {{ information.user.email }}
            </el-descriptions-item>
            <el-descriptions-item v-if="information.user.qq">
              <template #label>
                <img src="../image/qq.svg" alt="L" width="14" height="14" />
                QQ
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
          <el-dialog v-model="followingDialogVisible" title="Following" center>
            <el-table :data="information.following" stripe style="width: 100%">
              <el-table-column label="User" align="center">
                <template #default="scope">
                  <el-link :href="`/user/${scope.row.name}`">
                    {{
                      scope.row.nickname ? scope.row.nickname : scope.row.name
                    }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column label="Codeforces" align="center">
                <template #default="scope">
                  <el-link
                    type="primary"
                    :href="`https://codeforces.com/profile/${scope.row.codeforces_handle}`"
                    target="_blank"
                    :underline="false"
                  >
                    <el-avatar
                      v-show="scope.row.codeforces_avatar"
                      :size="28"
                      :src="getCodeforcesAvatar(scope.row)"
                      style="margin-right: 6px"
                    />
                    {{ scope.row.codeforces_handle }}</el-link
                  >
                </template>
              </el-table-column>
              <el-table-column label="LeetCode" align="center">
                <template #default="scope">
                  <el-link
                    type="primary"
                    :href="`https://leetcode.cn/u/${scope.row.leetcode_handle}/`"
                    target="_blank"
                    :underline="false"
                  >
                    <el-avatar
                      v-show="scope.row.leetcode_avatar"
                      :size="28"
                      :src="getLeetcodeAvatar(scope.row)"
                      style="margin-right: 6px"
                    />{{ scope.row.leetcode_handle }}</el-link
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
          <el-dialog v-model="followersDialogVisible" title="Followers" center>
            <el-table :data="information.followers" stripe style="width: 100%">
              <el-table-column label="User" align="center">
                <template #default="scope">
                  <el-link :href="`/user/${scope.row.name}`">
                    {{
                      scope.row.nickname ? scope.row.nickname : scope.row.name
                    }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column label="Codeforces" align="center">
                <template #default="scope">
                  <el-link
                    type="primary"
                    :href="`https://codeforces.com/profile/${scope.row.codeforces_handle}`"
                    target="_blank"
                    :underline="false"
                  >
                    <el-avatar
                      v-show="scope.row.codeforces_avatar"
                      :size="28"
                      :src="getCodeforcesAvatar(scope.row)"
                      style="margin-right: 6px"
                    />
                    {{ scope.row.codeforces_handle }}</el-link
                  >
                </template>
              </el-table-column>
              <el-table-column label="LeetCode" align="center">
                <template #default="scope">
                  <el-link
                    type="primary"
                    :href="`https://leetcode.cn/u/${scope.row.leetcode_handle}/`"
                    target="_blank"
                    :underline="false"
                  >
                    <el-avatar
                      v-show="scope.row.leetcode_avatar"
                      :size="28"
                      :src="getLeetcodeAvatar(scope.row)"
                      style="margin-right: 6px"
                    />{{ scope.row.leetcode_handle }}</el-link
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </el-card>
        <el-card
          header="Career"
          style="margin: 10px; text-align: center; height: 460px"
        >
          <el-container>
            <el-aside width="66%"
              ><div id="acSubmissionsType" style="height: 400px"></div>
            </el-aside>
            <el-container>
              <el-header height="200px">
                <div id="totalSubmissions" style="height: 200px"></div>
              </el-header>
              <el-main>
                <el-tooltip
                  effect="light"
                  :content="`Top ${100 - careerPercentage}%`"
                  placement="top"
                >
                  <el-progress
                    style="height: 200px"
                    type="dashboard"
                    :percentage="careerPercentage"
                  >
                    <span
                      style="
                        display: block;
                        margin-top: -48px;
                        font-size: 18px;
                        font-weight: 700;
                        color: #464646;
                      "
                      >Rank:
                      {{
                        this.information.submissionStatus.career_ranking
                      }}</span
                    >
                  </el-progress>
                </el-tooltip>
              </el-main>
            </el-container>
          </el-container>
        </el-card>
        <el-card
          header="Activeness"
          style="margin: 10px; text-align: center; height: 540px"
        >
          <el-container style="height: 280px">
            <el-aside width="66%" style="overflow: visible">
              <div id="recentUserStatus" style="height: 280px"></div>
            </el-aside>
            <el-container>
              <el-header height="120px" style="padding: 0">
                <el-table :data="weekMonthData" style="width: 100%">
                  <el-table-column prop="type" label="Type" align="center" />
                  <el-table-column prop="ac" label="AC" align="center" />
                  <el-table-column prop="all" label="All" align="center" />
                </el-table>
              </el-header>
              <el-main style="overflow: hidden">
                <el-tooltip
                  effect="light"
                  :content="`Top ${100 - activePercentage}%`"
                  placement="top"
                >
                  <el-progress
                    style="height: 200px"
                    type="dashboard"
                    :percentage="activePercentage"
                  >
                    <span
                      style="
                        display: block;
                        margin-top: -48px;
                        font-size: 18px;
                        font-weight: 700;
                        color: #464646;
                      "
                      >Rank:
                      {{
                        this.information.submissionStatus.active_ranking
                      }}</span
                    >
                  </el-progress>
                </el-tooltip>
              </el-main>
            </el-container>
          </el-container>
          <div id="calendar" style="height: 180px"></div>
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
import { showCareerCharts, showActivityCharts } from "@/logic/chartDrawing";

export default {
  data() {
    return {
      information: {
        user: {},
        following: [],
        followers: [],
        submissionStatus: {},
        calendarSubmissions: [],
        allUserSubmissionStatus: {},
      },
      recentAcSubmissions: [],
      followingDialogVisible: false,
      followersDialogVisible: false,
      userNumber: 0,
      weekMonthData: [
        {
          type: "Week",
          ac: 0,
          all: 0,
        },
        {
          type: "Month",
          ac: 0,
          all: 0,
        },
      ],
      careerPercentage: 0,
      activePercentage: 0,
    };
  },
  methods: {
    getLeetcodeAvatar,
    getCodeforcesAvatar,
    getProblemUrl,
    getRatingColor,
    getFromNowTime,
    getWeekMonthData() {
      this.weekMonthData = [
        {
          type: "Week",
          ac: this.information.submissionStatus.week_ac_submission_number,
          all: this.information.submissionStatus.week_submission_number,
        },
        {
          type: "Month",
          ac: this.information.submissionStatus.month_ac_submission_number,
          all: this.information.submissionStatus.month_submission_number,
        },
      ];
    },
    getPercentage() {
      this.careerPercentage = Number(
        (
          100 -
          (this.information.submissionStatus.career_ranking /
            this.information.userNumber) *
            100
        ).toFixed(2)
      );
      this.activePercentage = Number(
        (
          100 -
          (this.information.submissionStatus.active_ranking /
            this.information.userNumber) *
            100
        ).toFixed(2)
      );
    },
    getPageData() {
      post(
        "/api/user/info",
        {
          user_name: this.$route.params.userName,
        },
        (result) => {
          this.information = result;
          if (!this.information.submissionStatus) {
            this.information.submissionStatus = {
              submission_number: 0,
              ac_submission_number: 0,
              easy_ac_submission_number: 0,
              medium_ac_submission_number: 0,
              hard_ac_submission_number: 0,
              veryhard_ac_submission_number: 0,
              hardcore_ac_submission_number: 0,
              norating_ac_submission_number: 0,
              average_ac_rating: 0,
              month_submission_number: 0,
              week_ac_submission_number: 0,
              week_average_ac_rating: 0,
              week_submission_number: 0,
              month_ac_submission_number: 0,
              month_average_ac_rating: 0,
              active_score: 0,
              career_ranking: 0,
              active_ranking: 0,
            };
          }
          showCareerCharts(this.information.submissionStatus);
          showActivityCharts(this.information);
          this.getWeekMonthData();
          this.getPercentage();
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
          order: { prop: "submit_time", order: "descending" },
        },
        (result) => {
          this.recentAcSubmissions = result;
        }
      );
    },
  },
  created() {
    if (this.$route.params.userName) {
      this.getPageData();
    }
  },
};
</script>
