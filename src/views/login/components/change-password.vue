<template>
  <div class="dialog-container">
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="360px"
      center
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form
        :model="formData"
        ref="form"
        label-width="100px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="uname">
          <el-input
            v-model="formData.uname"
            placeholder="请输入用户名"
            autocomplete="new-password"
          ></el-input>
        </el-form-item>
        <el-form-item label="原密码" prop="passwd">
          <el-input
            v-model="formData.passwd"
            type="password"
            autocomplete="new-password"
            placeholder="请输入登录密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPasswd">
          <el-input
            type="password"
            v-model="formData.newPasswd"
            autocomplete="new-password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="formData.checkPass"
            autocomplete="new-password"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var newPasswd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.formData.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.newPasswd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        uname: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        passwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPasswd: [
          {
            required: true,
            validator: newPasswd,
            trigger: 'blur'
          }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'change' }
        ]
      },
      formData: {
        uname: '',
        passwd: '',
        newPasswd: '',
        checkPass: ''
      },
      dialogVisible: false
    }
  },
  watch: {
    async dialogVisible(newVal) {
      if (newVal) {
        this.initData()
        this.$refs.form && this.$refs.form.resetFields()
      }
    }
  },
  methods: {
    initData() {
      this.formData = {
        uname: '',
        passwd: '',
        newPasswd: '',
        checkPass: ''
      }
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        await this.$api.changePassword({ ...this.formData })
        this.$message.success('密码修改成功')
        this.dialogVisible = false
      })
    },
    close() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  ::v-deep .el-dialog {
    border-radius: 6px;
    .el-dialog__header {
      font-size: 18px;
      text-align: center;
      font-weight: 500;
      background: #3182ff;
      padding: 0;
      line-height: 54px;
      border-radius: 4px 4px 0px 0px;
      .el-dialog__title {
        color: #ffffff;
      }
    }
  }
  .dialog-footer {
    button {
      width: 100px;
      &:nth-of-type(1) {
        margin-right: 20px;
      }
    }
  }
}
.manage-area {
  .el-checkbox-group {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 10px 0 10px 30px;
    background: #fafafa;
    margin-top: -5px;
    .el-checkbox {
      width: 80px;
    }
  }
}
</style>
