<template>
  <el-container style="height: 100%">
    <el-header
      style="text-align: center; background-color: #eeeeee; line-height: 60px"
    >
      <el-button
        style="float: left; margin-top: 14px"
        @click="collapseMenu"
        text
      >
        <el-icon>
          <Menu />
        </el-icon>
      </el-button>
      <span v-if="userId">Hello, {{ userName }}</span>
      <span v-else>ACM Training Team Platform</span>
      <el-button
        v-if="userId"
        style="float: right; margin-top: 14px"
        @click="signOut"
        >Sign Out
      </el-button>
      <el-button
        v-else
        style="float: right; margin-top: 14px"
        @click="gotoSignIn"
        type="primary"
        >Sign In</el-button
      >
      <el-button
        v-if="$cookies.get('token')?.id === 9999"
        style="float: right; margin-top: 14px; margin-right: 20px"
        type="primary"
        @click="refreshData"
        :loading="refreshLoading"
      >
        Refresh data
        <el-icon :size="18"><Refresh /></el-icon>
      </el-button>
    </el-header>
    <el-container style="height: calc(100% - 60px)">
      <el-aside :width="asideWidth" style="transition: width 0.5s">
        <el-menu
          style="height: 100%; overflow: hidden"
          :collapse="menuCollapsed"
          :key="menuKey"
          class="el-menu-vertical"
          :collapse-transition="false"
          router
        >
          <el-menu-item index="ranking" route="/ranking">
            <el-icon>
              <DataAnalysis />
            </el-icon>
            <span>Ranking</span>
          </el-menu-item>
          <el-menu-item index="list" route="/list">
            <el-icon>
              <View />
            </el-icon>
            <span>Follow List</span>
          </el-menu-item>
          <el-menu-item index="problems" route="/problems">
            <el-icon>
              <Collection />
            </el-icon>
            <span>Problems</span>
          </el-menu-item>
          <el-menu-item
            v-if="$cookies.get('token')?.id !== 9999"
            index="user"
            :route="userId ? `/user/${userName}` : '/user'"
          >
            <el-icon> <User /> </el-icon>
            <span>User</span>
          </el-menu-item>
          <el-menu-item index="discussion" route="/discussion">
            <el-icon>
              <ChatDotSquare />
            </el-icon>
            <span>Discussion</span>
          </el-menu-item>
          <el-menu-item index="settings" route="/settings">
            <el-icon>
              <Setting />
            </el-icon>
            <span>Settings</span>
          </el-menu-item>
          <el-menu-item
            v-if="$cookies.get('token')?.id === 9999"
            index="admin"
            route="/admin"
          >
            <el-icon>
              <SetUp />
            </el-icon>
            <span>Admin</span>
          </el-menu-item>
          <el-menu-item
            v-if="$cookies.get('token')?.id === 9999"
            index="import"
            route="/import"
          >
            <el-icon>
              <Download />
            </el-icon>
            <span>Import</span>
          </el-menu-item>
          <el-menu-item
            v-if="$cookies.get('token')?.id === 9999"
            index="error"
            route="/error"
          >
            <el-icon>
              <Warning />
            </el-icon>
            <span>Error</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="padding: 0">
        <router-view
          @refreshUser="refreshUser"
          @refreshMenu="refreshMenu"
        ></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { post } from "@/logic/dataGetting";

export default {
  data() {
    return {
      menuKey: 0,
      menuCollapsed: false,
      asideWidth: "150px",
      cookie: this.$cookies.get("token"),
      userName: "",
      userId: 0,
      refreshLoading: false,
    };
  },
  methods: {
    signOut() {
      this.$router.push("/signin");
      this.$message({
        message: "You have signed out successfully.",
        duration: 1000,
      });
      this.$cookies.remove("token");
      this.userName = "";
      this.userId = 0;
    },
    gotoSignIn() {
      this.$router.push("/signin");
    },
    collapseMenu() {
      this.menuCollapsed = !this.menuCollapsed;
      this.asideWidth = this.menuCollapsed ? "65px" : "150px";
    },
    refreshUser() {
      this.userName = this.$cookies.get("token")?.name;
      this.userId = this.$cookies.get("token")?.id;
    },
    refreshMenu() {
      this.menuKey++;
    },
    refreshData() {
      post("/api/user/refresh", null, (result) => {
        this.$message({
          message: result,
          duration: 8000,
        });
      });
      this.refreshLoading = true;
      setTimeout(() => {
        this.$message({
          message: "Refresh has finished.",
        });
        this.refreshLoading = false;
      }, 200000);
    },
  },
  async created() {
    this.refreshUser();
  },
};
</script>

<style scoped></style>
