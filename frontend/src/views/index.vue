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
      <span v-if="cookie">Hello, {{ userName }}</span>
      <span v-else>Nanjing University's ACM Platform</span>
      <el-button
        v-if="cookie"
        style="float: right; margin-top: 14px"
        @click="signOut"
        >Sign Out</el-button
      >
      <el-button v-else style="float: right; margin-top: 14px" @click="gotoSignIn"
        >Sign In</el-button
      >
    </el-header>
    <el-container>
      <el-aside :width="asideWidth" style="transition: width 0.5s">
        <el-menu
          style="height: 100%"
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
          <el-menu-item index="following" route="/following">
            <el-icon>
              <View />
            </el-icon>
            <span>Following</span>
          </el-menu-item>
          <el-menu-item index="problems" route="/problems">
            <el-icon>
              <Collection />
            </el-icon>
            <span>Problems</span>
          </el-menu-item>
          <el-menu-item
            index="user"
            :route="cookie ? `/user/${cookie}` : '/user'"
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
        </el-menu>
      </el-aside>
      <el-main style="padding: 0">
        <router-view
          @refreshCookie="refreshCookie"
          @refreshMenu="refreshMenu"
        ></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuKey: 0,
      menuCollapsed: false,
      asideWidth: "150px",
      cookie: this.$cookies.get("userId"),
      userName: "wushenghao",
    };
  },
  methods: {
    signOut() {
      this.$router.push("/signin");
      this.$message("You have signed out successfully.");
      this.$cookies.remove("userId");
      this.refreshCookie();
    },
    gotoSignIn() {
      this.$router.push("/signin");
    },
    collapseMenu() {
      this.menuCollapsed = !this.menuCollapsed;
      this.asideWidth = this.menuCollapsed ? "65px" : "150px";
    },
    refreshCookie() {
      this.cookie = this.$cookies.get("userId");
    },
    refreshMenu() {
      this.menuKey++;
    },
  },
  async created() {
    try {
      const res = await this.$http.get("/test");
      if (res.data !== 2) {
        this.$message.error("The database is not working properly.");
      } else {
        console.log("Backend is OK.");
      }
    } catch (err) {
      this.$message.error(err);
    }
  },
};
</script>

<style scoped></style>
