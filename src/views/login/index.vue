<template>
  <div class="login-container">
    <div class="title-container">
      <h3 class="title">某某某监狱视频会见管理系统</h3>
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <!-- <el-form-item props>
        <span class="svg-container">
          <i class="el-icon-location-information"></i>
        </span>
        <el-select v-model="loginForm.manageArea" placeholder="请选择监区">
          <el-option label="监区1" value="area1"></el-option>
          <el-option label="监区2" value="area2"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入账号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <div>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-top: 26px"
          @click.native.prevent="handleLogin"
        >
          登录</el-button
        >
      </div>
      <div style="text-align: center">
        <el-button
          type="text"
          @click.native.prevent="$refs.changePassword.dialogVisible = true"
        >
          忘记密码</el-button
        >
      </div>
    </el-form>
    <change-password ref="changePassword" />
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import changePassword from './components/change-password.vue'
export default {
  components: { changePassword },
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不小于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        // manageArea: '',
        username: '',
        password: '',
        vcode: ''
      },
      loginRules: {
        // username: [
        //   { required: true, trigger: 'blur', validator: validateUsername }
        // ],
        // password: [
        //   { required: true, trigger: 'blur', validator: validatePassword }
        // ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #000000;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input,
  .el-select {
    display: inline-block;
    height: 47px;
    width: 85%;
    .el-input {
      width: 100%;
    }

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      // caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #000 !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #fff;
    border-radius: 5px;
    color: #454545;
    margin-bottom: 14px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  background-image: url('../../assets/bg.png');
  background-size: cover;
  .login-form {
    position: relative;
    width: 400px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
    background-image: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.31) 0%,
      rgba(255, 255, 255, 0.47) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 50px 45px;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 44px;
      color: #ffffff;
      letter-spacing: 0;
      line-height: 44px;
      font-weight: 400;
      // color: $light_gray;
      margin: 160px auto 62px auto;
      text-align: center;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .svg-container {
    font-size: 20px;
    color: #cccccc;
    margin: 0 9px 0 15px;
  }
}
</style>
