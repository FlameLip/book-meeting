<template>
  <div class="navbar">
    <div class="title-container">
      <img
        src="https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png"
        alt=""
      />
      <h3>某某某监狱视频会见管理系统</h3>
    </div>
    <div class="right-menu">
      <img
        src="https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png"
        alt=""
      />
      <span>管理员</span>
      <span style="padding: 0 10px">|</span>
      <span @click="logout" style="cursor: pointer">退出</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
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
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background-image: linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
  display: flex;
  .title-container {
    padding-left: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 34px;
      height: 34px;
    }
  }
  .right-menu {
    height: 100%;
    line-height: 60px;
    position: absolute;
    right: 30px;
    top: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    color: #404040;
    img {
      width: 32px;
      height: 32px;
      padding-right: 10px;
    }
  }
}
</style>
