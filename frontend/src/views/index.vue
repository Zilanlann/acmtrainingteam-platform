<template>
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
      :icon="Menu"
    >
    </el-button>
    <span>Nanjing University's ACM Platform</span>
    <el-button style="float: right; margin-top: 14px" @click="signOut">
      Sign Out</el-button
    >

    <el-main>
      <router-view></router-view>
    </el-main>
  </el-header>

  <el-row class="tac">
    <el-aside style="width: 160px">
      <el-col>
        <el-menu
          default-active="ranking"
          :collapse="menuCollapsed"
          class="el-menu-vertical"
          id="el-menu"
          router
        >
          <el-menu-item index="ranking">
            <el-icon><DataAnalysis /></el-icon>
            <span>Ranking</span>
          </el-menu-item>
          <el-menu-item index="following">
            <el-icon><View /></el-icon>
            <span>Following</span>
          </el-menu-item>
          <el-menu-item index="problems">
            <el-icon><Collection /></el-icon>
            <span>Problems</span>
          </el-menu-item>
          <el-menu-item index="user">
            <el-icon><User /></el-icon>
            <span>User</span>
          </el-menu-item>
          <el-menu-item index="discussion">
            <el-icon><ChatDotSquare /></el-icon>
            <span>Discussion</span>
          </el-menu-item>
          <el-menu-item index="settings">
            <el-icon><Setting /></el-icon>
            <span>Settings</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-aside>
  </el-row>
</template>

<script lang="ts">
import { ElMessage } from "element-plus";

export default {
  name: "Index",
  data() {
    return {
      menuCollapsed: false,
      userName: "wushenghao",
    };
  },
  methods: {
    signOut() {
      ElMessage("Sign out successfully.");
    },
  },
};
</script>

<script lang="ts" setup>
import { Menu } from "@element-plus/icons-vue";
</script>

<style scoped>
a {
  text-decoration: none !important;
}
</style>
