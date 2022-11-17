<template>
  <el-container style="height: 100%">
    <el-header
      style="
        text-align: center;
        background-color: rgb(238, 241, 246);
        line-height: 60px;
      "
    >
      <el-button
        style="float: left; margin-top: 14px"
        @click="menuCollapsed = !menuCollapsed"
        text
      >
        <el-icon>
          <Menu />
        </el-icon>
      </el-button>
      <span>Nanjing University's ACM Platform</span>
      <el-button style="float: right; margin-top: 14px" @click="signOut">
        Sign Out</el-button
      >
    </el-header>

    <el-row style="height: calc(100% - 60px)">
      <el-menu
        style="height: 100%"
        :collapse="menuCollapsed"
        :key="menuKey"
        class="el-menu-vertical"
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

      <el-main style="padding: 0">
        <router-view
          @refreshCookie="refreshCookie"
          @refreshMenu="refreshMenu"
        ></router-view>
      </el-main>
    </el-row>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuKey: 0,
      menuCollapsed: false,
      cookie: this.$cookies.get("userId"),
    };
  },
  methods: {
    signOut() {
      this.$router.push("/signin");
      this.$message("You have signed out successfully.");
      this.$cookies.remove("userId");
      this.refreshCookie();
    },
    refreshCookie() {
      this.cookie = this.$cookies.get("userId");
    },
    refreshMenu() {
      this.menuKey++;
    },
  },
};
</script>

<style scoped></style>
