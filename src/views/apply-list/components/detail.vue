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
                <div class="table-td">{{ rowData.members[0].verifyTime }}</div>
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
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="reject">拒绝</el-button>
        <el-button type="success" @click="accept">审核</el-button>
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
      timeList: []
    }
  },
  props: ['rowData'],
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        const { fxProfilePhotoUrl, members } = this.rowData
        this.srcList = [
          fxProfilePhotoUrl,
          members[0].memberPIDImgZUrl,
          members[0].memberPIDImgBUrl
        ]
      }
    }
  },
  methods: {
    async getApplyrRejectList() {
      const res = await this.$api.getApplyrRejectList()
      this.reasonList = res
    },
    async getUsableTimeList() {
      const res = await this.$api.getUsableTimeList()
      this.time = res
    },
    async accept() {
      await this.$api.applyrAccept({
        prisonId: '', //监狱ID
        meetingId: this.rowData.meetingId,
        windowId: this.rowData.windowId,
        order: this.formData.order,
        sTime: this.formData.sTime,
        eTime: this.formData.eTime
      })
      this.$message.success('操作成功')
      this.dialogVisible = false
      this.$emit('reload')
    },
    async reject() {
      await this.$api.applyrReject({
        prisonId: '', //监狱ID
        meetingId: this.rowData.meetingId,
        windowId: this.rowData.windowId,
        order: this.formData.order,
        sTime: this.formData.sTime,
        eTime: this.formData.eTime
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
        .el-image:nth-of-type(1) {
          margin-bottom: 10px;
        }
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
</style>