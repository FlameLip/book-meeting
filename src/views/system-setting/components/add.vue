<template>
  <div class="dialog-container">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="400px"
      center
      :show-close="false"
    >
      <el-form
        :model="formData"
        ref="form"
        label-width="120px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="单位名称" prop="prisonName">
          <!-- <el-input v-model="formData.prisonName"></el-input> -->
          <el-input
            v-model="formData.prisonName"
            placeholder="请输入单位名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
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
        prisonName: [
          { required: true, message: '请填写单位名称', trigger: 'blur' }
        ]
      },
      formData: {
        prisonName: ''
      },
      dialogVisible: false,
      title: '新增单位'
    }
  },
  props: ['prisonData', 'prisonId', 'maxMeetingTimes'],
  watch: {
    dialogVisible(newVal) {
      this.formData = {
        prisonName: ''
      }
      if (newVal) {
        if (Object.keys(this.prisonData).length) {
          this.formData = this.prisonData
          this.title = '修改单位'
        } else {
          this.title = '新增单位'
        }
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        if (!Object.keys(this.prisonData).length) {
          const res = await this.$api.addPrison({
            ...this.formData,
            province: '',
            city: '',
            maxMeetingTimes: this.maxMeetingTimes
          })
          this.$emit('reload')
          this.$message.success('操作成功')
          this.dialogVisible = false
        } else {
          const res = await this.$api.editPrison({
            ...this.formData,
            prisonId: this.prisonId
          })
          this.$emit('addPrison', res.prisonId)
          this.$message.success('操作成功')
          this.dialogVisible = false
        }
      })
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
