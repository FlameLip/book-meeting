<template>
  <div class="dialog-container">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="1000px"
      center
      :show-close="false"
    >
      <el-form
        :model="formData"
        ref="addUser"
        label-width="120px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="用户名：" prop="uname">
          <el-input
            style="width: 220px"
            v-model="formData.uname"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录密码：" prop="passwd">
          <el-input
            style="width: 220px"
            v-model="formData.passwd"
            placeholder="请输入登录密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="审核权限：" prop="verifyLv">
          <el-select
            v-model="formData.verifyLv"
            placeholder="请选择审核权限"
            style="width: 220px"
          >
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="控制安全级别：" prop="isSafety">
          <el-select
            v-model="formData.isSafety"
            placeholder="请选择控制安全级别"
            style="width: 220px"
          >
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="管理区域："
          prop="manageAreaList"
          class="manage-area"
        >
          <el-checkbox-group v-model="formData.manageAreaList">
            <el-checkbox
              v-for="item in 20"
              :key="item"
              :label="'监区' + item"
              name="manageAreaList"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="close">拒绝</el-button>
        <el-button type="success" @click="submit">审核</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rules: {
        uname: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        passwd: [
          { required: true, message: '请填写登录密码', trigger: 'blur' }
        ],
        verifyLv: [
          { required: true, message: '请选择审核权限', trigger: 'change' }
        ],
        isSafety: [
          {
            required: true,
            message: '请选择是否控制安全级别',
            trigger: 'change'
          }
        ],
        manageAreaList: [
          {
            type: 'array',
            required: true,
            message: '请至少选择管理区域',
            trigger: 'change'
          }
        ]
      },
      formData: {
        uname: '',
        passwd: '',
        verifyLv: '',
        isSafety: '', // false/true
        manageAreaList: []
      },
      dialogVisible: false,
      title: '申请详情'
    }
  },
  props: ['rowData'],
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.initData()
        this.formData = this.rowData
      }
    }
  },
  methods: {
    initData() {
      this.formData = {
        uname: '',
        passwd: '',
        verifyLv: '',
        isSafety: '', // false/true
        manageAreaList: []
      }
      this.title = '添加用户'
    },
    submit() {
      this.$refs.addUser.validate(valid => {
        if (!valid) return
        console.log('submit!')
      })
    },
    close() {
      this.dialogVisible = false
      // this.$refs.addUser.resetFields()
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