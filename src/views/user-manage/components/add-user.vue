<template>
  <div class="dialog-container">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="788px"
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
        <el-form-item label="用户名" prop="uname">
          <el-input
            style="width: 220px"
            v-model="formData.uname"
            placeholder="请输入用户名"
            :disabled="type === 'edit'"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="passwd" :required="type === 'add'">
          <el-input
            style="width: 220px"
            v-model="formData.passwd"
            placeholder="请输入登录密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="prisonName" v-if="userInfo.isSuper">
          <el-select v-model="formData.prisonName" @change="handlePrisonChange">
            <el-option
              v-for="item in prisonList"
              :label="item.prisonName"
              :value="item.prisonName"
              :key="item.prisonName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核权限" prop="verifyStep">
          <el-select
            v-model="formData.verifyStep"
            placeholder="请选择审核权限"
            style="width: 220px"
          >
            <el-option
              v-for="item in verifyList"
              :label="item.label"
              :key="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="控制安全级别" prop="isSafety">
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
          label="管理区域"
          prop="manageAreaList"
          class="manage-area"
        >
          <el-checkbox-group v-model="formData.manageAreaList">
            <el-checkbox
              v-for="item in areaList"
              :key="item"
              :label="item"
              :name="item"
            ></el-checkbox>
          </el-checkbox-group>
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
    return {
      rules: {
        uname: [
          { required: true, message: '请输入用户名称', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        verifyStep: [
          { required: true, message: '请选择审核权限', trigger: 'change' }
        ],
        isSafety: [
          {
            required: true,
            message: '请选择是否控制安全级别',
            trigger: 'change'
          }
        ],
        prisonName: [
          {
            required: true,
            message: '请选择单位',
            trigger: 'change'
          }
        ],
        manageAreaList: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个管理区域',
            trigger: 'change'
          }
        ]
      },
      formData: {
        uname: '',
        passwd: '',
        verifyStep: '',
        prisonName: '',
        isSafety: '', // false/true
        manageAreaList: []
      },
      dialogVisible: false,
      title: '添加用户',
      verifyList: [],
      areaList: [],
      prisonList: [],
      prisonId: sessionStorage.getItem('prisonId')
    }
  },
  props: ['rowData'],
  watch: {
    async dialogVisible(newVal) {
      if (newVal) {
        this.initData()

        if (this.type === 'edit') {
          this.formData = this.rowData
          this.title = '修改用户'
        } else {
          this.$refs.addUser && this.$refs.addUser.resetFields()
        }
      }
    }
  },
  computed: {
    type() {
      return Object.keys(this.rowData).length ? 'edit' : 'add'
    },
    userInfo() {
      return JSON.parse(sessionStorage.getItem('userInfo'))
    }
  },
  mounted() {
    this.userInfo.isSuper && this.getPrisonList()
    this.getAreaList()
    this.getVerifyList()
  },
  methods: {
    async getPrisonList() {
      const res = await this.$api.getPrisonList()
      this.prisonList = res
    },
    handlePrisonChange(val) {
      const prisonItem = this.prisonList.find(item => item.prisonName === val)
      this.prisonId = prisonItem.prisonId
      this.getAreaList()
      this.getVerifyList()
    },
    async getAreaList() {
      const res = await this.$api.getAreaList({ prisonId: this.prisonId })
      this.areaList = res.map(item => item.name)
    },
    async getVerifyList() {
      const res = await this.$api.getVerifyList({ prisonId: this.prisonId })
      this.verifyList = res.map(item => {
        return {
          value: item.step,
          label: item.name
        }
      })
    },
    initData() {
      this.formData = {
        uname: '',
        passwd: '',
        verifyStep: '',
        isSafety: '', // false/true
        manageAreaList: []
      }
      this.title = '添加用户'
    },
    submit() {
      this.$refs.addUser.validate(async valid => {
        if (!valid) return
        let instance = ''
        if (this.type === 'edit') {
          this.formData = this.rowData
          instance = this.$api.modifyUser
        } else {
          instance = this.$api.addUser
        }
        await instance({ ...this.formData, prisonId: this.prisonId })
        this.$message.success('操作成功')
        this.$emit('reload')
        this.dialogVisible = false
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
