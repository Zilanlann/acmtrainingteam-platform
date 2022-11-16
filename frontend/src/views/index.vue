<template>
  <el-container style="height: 100%">
    <el-header style="text-align: center; background-color: rgb(238, 241, 246); line-height: 60px">
      <el-button style="float: left; margin-top: 14px" @click="menuCollapsed = !menuCollapsed" text :icon="Menu"> </el-button>
      <span>Nanjing University's ACM Platform</span>
      <el-button style="float: right; margin-top: 14px" @click="signOut"> Sign Out</el-button>
    </el-header>

    <el-row style="height: calc(100% - 60px)">
      <el-menu style="height: 100%" default-active="/ranking" :collapse="menuCollapsed" class="el-menu-vertical" router>
        <el-menu-item index="/ranking">
          <el-icon>
            <DataAnalysis />
          </el-icon>
          <span>Ranking</span>
        </el-menu-item>
        <el-menu-item index="/following">
          <el-icon>
            <View />
          </el-icon>
          <span>Following</span>
        </el-menu-item>
        <el-menu-item index="/problems">
          <el-icon>
            <Collection />
          </el-icon>
          <span>Problems</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <el-icon>
            <User />
          </el-icon>
          <span>User</span>
        </el-menu-item>
        <el-menu-item index="/discussion">
          <el-icon>
            <ChatDotSquare />
          </el-icon>
          <span>Discussion</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon>
            <Setting />
          </el-icon>
          <span>Settings</span>
        </el-menu-item>
      </el-menu>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-row>
  </el-container>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import router from "@/router";
import { Menu } from "@element-plus/icons-vue";

const menuCollapsed = ref(false);
const signOut = () => {
  router.push("/signin");
  ElMessage("Sign out successfully.");
};
</script>

<style scoped></style>
