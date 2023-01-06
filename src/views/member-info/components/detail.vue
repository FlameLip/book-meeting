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
          <div style="margin-bottom: 8px">
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
          <div>
            <el-image
              style="width: 160px; height: 160px"
              :src="rowData.memberProfilePhotoUrl"
              :preview-src-list="srcList"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <div class="img-desc">家属头像</div>
          </div>
        </div>
        <div class="info-right">
          <div class="table-box">
            <ul>
              <li>
                <div class="table-tr">服刑人员</div>
                <div class="table-td">{{ rowData.fxName }}</div>
              </li>
              <li>
                <div class="table-tr">审核状态</div>
                <div class="table-td">
                  {{ statusObj[rowData.verifyStatus] || '' }}
                </div>
              </li>
              <li>
                <div class="table-tr">所在监区</div>
                <div class="table-td">{{ rowData.areaName }}</div>
              </li>
              <li>
                <div class="table-tr">审核用户</div>
                <div class="table-td">{{ rowData.verifyUser }}</div>
              </li>
              <li>
                <div class="table-tr">家属关系</div>
                <div class="table-td">{{ rowData.memberRelation }}</div>
              </li>
              <li>
                <div class="table-tr">审核时间</div>
                <div class="table-td">{{ rowData.verifyTime }}</div>
              </li>
              <li>
                <div class="table-tr">家属姓名</div>
                <div class="table-td">{{ rowData.memberName }}</div>
              </li>
              <li>
                <div class="table-tr">身份号码</div>
                <div class="table-td">{{ rowData.memberPID }}</div>
              </li>
              <li>
                <div class="table-tr">家属性别</div>
                <div class="table-td">{{ rowData.gender }}</div>
              </li>
              <li>
                <div class="table-tr">签发机关</div>
                <div class="table-td">{{ rowData.issuingAuthority }}</div>
              </li>
              <li>
                <div class="table-tr">认证电话</div>
                <div class="table-td">{{ rowData.memberPhoneCode }}</div>
              </li>
              <li>
                <div class="table-tr">有效期限</div>
                <div class="table-td">{{ rowData.validPeriod }}</div>
              </li>
              <li>
                <div class="table-tr">家庭住址</div>
                <div class="table-td">{{ rowData.address }}</div>
              </li>
            </ul>
          </div>
          <div class="card-box">
            <div class="card-item">
              <h3>辅助证明</h3>
              <el-image
                style="width: 196px; height: 125px"
                :src="rowData.assistImgUrl"
                :preview-src-list="srcList"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <div class="card-item">
              <h3>家属身份证照片</h3>
              <div style="display: flex">
                <el-image
                  style="width: 224px; height: 125px"
                  :src="rowData.memberPIDImgZUrl"
                  :preview-src-list="srcList"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <el-image
                  style="width: 224px; height: 125px"
                  :src="rowData.memberPIDImgBUrl"
                  :preview-src-list="srcList"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </div>
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
const statusObj = {
  0: '未审核',
  1: '审核通过',
  '-1': '审核拒绝',
  '-2': '取消审核'
}
export default {
  data() {
    return {
      dialogVisible: false,
      srcList: [],
      statusObj
    }
  },
  computed: {
    prisonId() {
      return sessionStorage.getItem('prisonId')
    }
  },
  props: ['rowData'],
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        const {
          fxProfilePhotoUrl,
          memberProfilePhotoUrl,
          memberPIDImgZUrl,
          memberPIDImgBUrl,
          assistImgUrl
        } = this.rowData
        this.srcList = [
          fxProfilePhotoUrl,
          memberProfilePhotoUrl,
          memberPIDImgZUrl,
          memberPIDImgBUrl,
          assistImgUrl
        ]
      }
    }
  },
  methods: {
    async accept() {
      await this.$api.memberAccept([
        {
          prisonId: this.prisonId, //监狱ID
          fxId: this.rowData.fxId, // 囚号
          pid: this.rowData.memberPID // 家属身份证号
        }
      ])
      this.$message.success('操作成功')
      this.dialogVisible = false
      this.$emit('reload')
    },
    async reject() {
      await this.$api.memberReject({
        prisonId: this.prisonId, //监狱ID
        areaName: this.rowData.areaName, //监区ID
        fxId: this.rowData.fxId, // 囚号
        fxName: this.rowData.fxName, // 服务人员姓名
        pid: this.rowData.memberPID // 家属身份证号
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
      margin-right: 20px;
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
    .info-right {
      .table-box {
        width: 100%;
        border-top: 1px solid rgba(238, 238, 238, 1);
        ul {
          display: flex;
          flex-wrap: wrap;
          li {
            height: 40px;
            line-height: 40px;
            width: 50%;
            display: flex;
            .table-tr {
              text-align: center;
              width: 88px;
              font-size: 13px;
              color: #7a8fa8;
              border: 1px solid rgba(238, 238, 238, 1);
              border-top: none;
            }
            .table-td {
              width: 282px;
              padding-left: 18px;
              font-size: 13px;
              color: #4a4a4a;
              border-bottom: 1px solid rgba(238, 238, 238, 1);
              border-right: 1px solid rgba(238, 238, 238, 1);
            }
            &:nth-of-type(odd) {
              .table-td {
                border-right: none;
              }
            }
            &:nth-last-of-type(1) {
              width: 100%;
              margin-bottom: 10px;
              .table-td {
                width: 652px;
                border-right: 1px solid rgba(238, 238, 238, 1);
              }
            }
            &:nth-of-type(5),
            &:nth-of-type(6) {
              margin-bottom: 10px;
            }
            &:nth-of-type(7),
            &:nth-of-type(8) {
              border-top: 1px solid rgba(238, 238, 238, 1);
            }
          }
        }
      }
      .card-box {
        width: 100%;
        display: flex;
        border: 1px solid rgba(238, 238, 238, 1);
        .card-item {
          padding: 11px 22px 20px;
          &:nth-of-type(1) {
            width: 240px;
            border-right: 1px solid rgba(238, 238, 238, 1);
          }
          .el-image {
            margin-right: 10px;
          }
          h3 {
            font-size: 13px;
            color: #7a8fa8;
            line-height: 13px;
            margin-bottom: 11px;
          }
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
