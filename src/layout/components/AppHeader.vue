<!--
 * @Descripttion:
 * @Version: 1.0
 * @Author: FlameLip 18070568168@163.com
 * @Date: 2022-12-05 15:49:21
-->
<template>
  <div class="navbar">
    <div class="title-container">
      <img src="../../assets/logo.png" alt="" />
      <h3>某某某监狱视频会见管理系统</h3>
    </div>
    <div class="right-menu">
      <img src="../../assets/avatar.png" alt="" />
      <span>{{ userInfo.isSuper ? '管理员' : userInfo.uname }}</span>
      <span class="Separation"></span>
      <span @click="logout" style="cursor: pointer">退出</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  computed: {
    userInfo() {
      return JSON.parse(sessionStorage.getItem('userInfo'))
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background-image: linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e2e2e2;
  .title-container {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 34px;
      height: 34px;
      margin: 0 10px 0 26px;
    }
    h3 {
      font-size: 20px;
      color: #2b3b57;
      font-weight: 600;
    }
  }
  .right-menu {
    height: 100%;
    line-height: 60px;
    margin-right: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    color: #404040;
    img {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }
    .Separation {
      margin: 0 10px;
      border-left: 1px solid #404040;
      height: 16px;
    }
  }
}
</style>
