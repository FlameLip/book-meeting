<template>
  <div class="dialog-container">
    <el-dialog
      :visible.sync="dialogVisible"
      width="1000px"
      center
      :show-close="false"
    >
      <div class="info-content">
        <div class="info-left">
          <el-image
            style="width: 160px; height: 160px"
            :src="rowData.fxProfilePhotoUrl"
            :preview-src-list="srcList"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="img-desc">服刑人员头像</div>
        </div>
        <div class="info-middle">
          <div class="table-box">
            <ul>
              <li>
                <div class="table-tr">服刑人员</div>
                <div class="table-td">{{ rowData.fxName }}</div>
              </li>
              <li>
                <div class="table-tr">所在监区</div>
                <div class="table-td">{{ rowData.areaName }}</div>
              </li>
              <li>
                <div class="table-tr">身份号码</div>
                <div class="table-td">{{ rowData.members[0].memberPID }}</div>
              </li>
              <li>
                <div class="table-tr">家属关系</div>
                <div class="table-td">
                  {{ rowData.members[0].memberRelation }}
                </div>
              </li>
              <li>
                <div class="table-tr">关系类型</div>
                <div class="table-td">{{ rowData.members[0].memberType }}</div>
              </li>
              <li>
                <div class="table-tr">户籍</div>
                <div class="table-td">
                  {{ rowData.members[0].censusRegister }}
                </div>
              </li>
              <li>
                <div class="table-tr">性别</div>
                <div class="table-td">{{ rowData.members[0].gender }}</div>
              </li>
              <li>
                <div class="table-tr">认证电话</div>
                <div class="table-td">{{ rowData.memberPhoneCode }}</div>
              </li>
              <li>
                <div class="table-tr">家庭住址</div>
                <div class="table-td">{{ rowData.members[0].address }}</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="info-right">
          <h3>身份证照片</h3>
          <div class="img-box">
            <el-image
              style="width: 241px; height: 136px"
              :src="rowData.members[0].memberPIDImgZUrl"
              :preview-src-list="srcList"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <el-image
              style="width: 241px; height: 136px"
              :src="rowData.members[0].memberPIDImgBUrl"
              :preview-src-list="srcList"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </div>
      </div>
      <el-form
        :model="formData"
        label-width="80px"
        style="margin: 20px 0 0 170px"
      >
        <el-form-item label="会见时间" prop="window">
          <el-radio-group v-model="formData.window" :border="true" size="small">
            <el-radio-button
              v-for="(item, index) in windowList"
              :label="item.label"
              :key="index"
            ></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="拒绝原因">
          <el-select
            v-model="formData.reason"
            placeholder="请选择拒绝原因"
            style="width: 220px"
          >
            <el-option
              v-for="(item, index) in reasonList"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="reject">拒绝</el-button>
        <el-button
          type="success"
          @click="accept"
          :disabled="rowData.verifyFinish || !rowData.isUserCanVerify"
          >审核</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      srcList: [],
      reasonList: [],
      timeList: [],
      formData: {
        window: '',
        reson: ''
      },
      windowList: []
    }
  },
  computed: {
    prisonId() {
      return sessionStorage.getItem('prisonId')
    }
  },
  props: ['rowData'],
  watch: {
    async dialogVisible(newVal) {
      if (newVal) {
        const { fxProfilePhotoUrl, members } = this.rowData
        this.srcList = [
          fxProfilePhotoUrl,
          members[0].memberPIDImgZUrl,
          members[0].memberPIDImgBUrl
        ]
        // this.getApplyrRejectList()
        await this.getUsableTimeList()
        this.initWindow()
      }
    }
  },
  methods: {
    initWindow() {
      const item = this.windowList.find(item => {
        if (
          this.rowData.windowId === item.windowId &&
          this.rowData.startTime === item.startTime &&
          this.rowData.endTime === item.endTime
        ) {
          return item
        }
      })
      if (!item) return
      this.formData.window = `${item.windowId} ${item.startTime}-${item.endTime} 剩余${item.orders.length}`
    },
    async getApplyrRejectList() {
      const res = await this.$api.getApplyrRejectList()
      this.reasonList = res
    },
    async getUsableTimeList() {
      const res = await this.$api.getUsableTimeList({
        prisonId: this.prisonId, //监狱ID
        meetingId: this.rowData.meetingId,
        meetingDate: this.rowData.meetingDate
      })
      const arr = []
      res.list.forEach(item => {
        item.timeRange.forEach(_item => {
          arr.push({
            windowId: item.windowId,
            windowName: item.windowName,
            label: `${item.windowId} ${_item.startTime}-${_item.endTime} 剩余${_item.orders.length}`,
            ..._item
          })
        })
      })
      this.windowList = arr
    },
    async accept() {
      if (!this.formData.window) return this.$message.error('请选择会见时间')
      const item = this.windowList.find(
        item => item.label === this.formData.window
      )
      await this.$api.applyrAccept({
        prisonId: this.prisonId, //监狱ID
        meetingDate: this.rowData.meetingDate,
        meetingId: this.rowData.meetingId,
        windowId: item.windowId,
        order: item.orders[0],
        startTime: item.startTime,
        endTime: item.endTime
      })
      this.$message.success('操作成功')
      this.dialogVisible = false
      this.$emit('reload')
    },
    async reject() {
      if (!this.formData.reason) return this.$message.error('请选择拒绝原因')
      await this.$api.applyrReject({
        prisonId: this.prisonId, //监狱ID
        meetingId: this.rowData.meetingId,
        reason: 'this.formData.reason'
        // reason: this.formData.reason
      })
      this.$message.success('操作成功')
      this.dialogVisible = false
      this.$emit('reload')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  .el-radio-button {
    ::v-deep .el-radio-button__inner {
      border-left: 1px solid #dcdfe6;
      box-shadow: none;
      border-radius: none;
    }
  }
  .info-content {
    display: flex;
    padding: 15px 15px 2px;
    .info-left {
      margin-right: 10px;
      .img-desc {
        width: 160px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        color: #ffffff;
        background: #7b94bc;
        margin-top: -4px;
      }
    }
    .info-middle {
      margin-right: 10px;
      .table-box {
        border: 1px solid rgba(238, 238, 238, 1);
        ul {
          li {
            height: 36px;
            line-height: 36px;
            display: flex;
            .table-tr {
              text-align: right;
              width: 88px;
              padding-right: 18px;
              font-size: 13px;
              color: #7a8fa8;
              border-bottom: 1px solid rgba(238, 238, 238, 1);
              border-right: 1px solid rgba(238, 238, 238, 1);
            }
            .table-td {
              width: 366px;
              padding-left: 18px;
              font-size: 13px;
              color: #4a4a4a;
              border-bottom: 1px solid rgba(238, 238, 238, 1);
            }
            &:nth-last-of-type(1) {
              height: 50px;
              line-height: 50px;
              .table-td {
                line-height: 16px;
                display: flex;
                align-items: center;
                border-bottom: none;
              }
              .table-tr {
                border-bottom: none;
              }
            }
          }
        }
      }
    }
    .info-right {
      width: 286px;
      border: 1px solid rgba(238, 238, 238, 1);
      h3 {
        background: #fcfdff;
        font-size: 13px;
        color: #7a8fa8;
        height: 36px;
        line-height: 36px;
        text-align: center;
      }
      .img-box {
        padding: 10px 22px;
        height: 302px;
        .el-image:nth-of-type(1) {
          margin-bottom: 10px;
        }
      }
    }
  }
  .el-radio-button {
    margin: 0 10px 10px 0;
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
</style>
