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
  </el-header>

  <el-row class="tac">
    <el-aside style="width: 160px">
      <el-col>
        <el-menu :collapse="menuCollapsed" class="el-menu-vertical-demo">
          <el-menu-item index="1">
            <el-icon><DataAnalysis /></el-icon>
            <span>Ranking</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><View /></el-icon>
            <span>Following</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><Collection /></el-icon>
            <span>Problems</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><User /></el-icon>
            <span>User</span>
          </el-menu-item>
          <el-menu-item index="5">
            <el-icon><ChatDotSquare /></el-icon>
            <span>Discussion</span>
          </el-menu-item>
          <el-menu-item index="6">
            <el-icon><Setting /></el-icon>
            <span>Settings</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-aside>
  </el-row>

  <el-main>
    <router-view></router-view>
  </el-main>
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
