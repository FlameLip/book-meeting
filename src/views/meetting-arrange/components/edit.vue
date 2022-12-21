<template>
  <div class="dialog-container">
    <el-dialog
      title="会见排班"
      :visible.sync="dialogVisible"
      width="400px"
      center
      :show-close="false"
    >
      <el-form
        :model="formData"
        ref="edit"
        label-width="120px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="会见时段" prop="meettingTime">
          <el-select
            v-model="formData.meettingTime"
            placeholder="请选择会见时段"
            style="width: 220px"
            @change="meetingTimeChange"
          >
            <el-option
              v-for="item in mettingTimeList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会见室" prop="windowId">
          <el-select
            v-model="formData.windowId"
            placeholder="请选择会见室"
            style="width: 220px"
            @change="windowChange"
            :disabled="!formData.meettingTime"
          >
            <el-option
              v-for="item in windowNameList"
              :key="item.windowId"
              :label="item.windowName"
              :value="item.windowId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-select
            v-model="formData.order"
            placeholder="请选择排序"
            style="width: 220px"
            :disabled="!formData.meettingTime || !formData.windowId"
          >
            <el-option
              v-for="item in orderList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
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
        meettingTime: [
          { required: true, message: '请选择会见时段', trigger: 'change' }
        ],
        windowId: [
          { required: true, message: '请选择会见室', trigger: 'change' }
        ],
        order: [
          {
            required: true,
            message: '请选择是否控制安全级别',
            trigger: 'change'
          }
        ]
      },
      formData: {
        meettingTime: '',
        windowId: '',
        order: ''
      },
      mettingTimeList: [],
      windowNameList: [],
      orderList: [],
      dialogVisible: false,
      prisonId: 'p-1ed1126e-7b61-11ed-8001-000000000001'
    }
  },
  props: ['rowData'],
  watch: {
    async dialogVisible(newVal) {
      if (newVal) {
        this.formData = this.rowData
        await this.getMettingUsableList()
        this.initWindow()
      }
    }
  },
  methods: {
    initWindow() {
      const item = this.mettingTimeList.find(item => {
        if (
          this.rowData.startTime === item.startTime &&
          this.rowData.endTime === this.rowData.endTime
        ) {
          return item
        }
      })
      if (!item) return
      this.formData.meettingTime = `${item.startTime}-${item.endTime}`
      this.windowNameList = item.windows
      this.orderList = this.windowNameList.find(
        item => item.windowId === this.formData.windowId
      ).orders
    },
    async getMettingUsableList() {
      const res = await this.$api.getMettingUsableList({
        prisonId: this.prisonId, //监狱ID
        meetingId: this.rowData.meetingId,
        meetingDate: this.rowData.meetingDate
      })
      const arr = []
      res.list.forEach(item => {
        arr.push({
          label: `${item.startTime}-${item.endTime}`,
          value: `${item.startTime}-${item.endTime}`,
          ...item
        })
      })
      this.mettingTimeList = arr
    },
    meetingTimeChange(val) {
      if (!val) return
      this.formData.windowId = ''
      this.formData.order = ''
      this.windowNameList = this.mettingTimeList.find(
        item => item.value === val
      ).windows
    },
    windowChange(val) {
      if (!val) return
      this.orderList = this.windowNameList.find(
        item => item.windowId === val
      ).orders
    },
    submit() {
      this.$refs.edit.validate(async valid => {
        if (!valid) return
        const [startTime, endTime] = this.formData.meettingTime.split('-')
        const params = {
          startTime,
          endTime,
          meetingId: this.rowData.meetingId,
          meetingDate: this.rowData.meetingDate,
          windowId: this.formData.windowId,
          order: this.formData.order,
          prisonId: this.prisonId
        }
        await this.$api.mettingRoomArrange(params)
        this.$message.success('操作成功')
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