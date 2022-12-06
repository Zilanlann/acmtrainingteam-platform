<template>
  <el-container style="height: 100%">
    <el-container style="padding: 20px" v-if="!$cookies.get('token')?.id">
      To view page of setting, please sign in first.
    </el-container>
    <el-container v-else>
      <el-header height="49px" style="text-align: center; padding-left: 0">
        <el-radio-group v-model="settingOption" style="margin-top: 8px">
          <el-radio-button
            label="Following"
            @click="this.$router.push('/settings/following')"
          />
          <el-radio-button
            label="User"
            @click="this.$router.push('/settings/user')"
          />
        </el-radio-group>
      </el-header>
      <el-divider style="margin: 0" />
      <el-container style="height: calc(100% - 50px)">
        <router-view></router-view>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      settingOption: "Following",
    };
  },
};
</script>
