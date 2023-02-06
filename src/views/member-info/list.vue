<template>
  <div class="app-container">
    <div class="search-form">
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchForm"
        label-position="right"
      >
        <el-form-item label="单位" prop="prisonName" v-if="userInfo.isSuper">
          <el-select
            v-model="searchForm.prisonName"
            @change="handlePrisonChange"
          >
            <el-option
              v-for="item in prisonList"
              :label="item.prisonName"
              :value="item.prisonName"
              :key="item.prisonName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服刑人员姓名" prop="fxName">
          <el-input v-model="searchForm.fxName"></el-input>
        </el-form-item>
        <el-form-item label="区域" prop="areaName">
          <el-select v-model="searchForm.areaName" clearable>
            <el-option
              v-for="item in areaList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="verifyStatus">
          <el-select v-model="searchForm.verifyStatus" clearable>
            <el-option
              v-for="(item, index) in statusObj"
              :label="item"
              :key="index"
              :value="+index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableList">查询</el-button>
          <el-button type="primary" @click="getTableList(true)"
            >查询全部</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="upload-box">
      <el-upload
        :action="uploadUrl"
        :data="extraParams"
        :headers="uploadHeader"
        :before-upload="handleBeforeUpload"
        :show-file-list="false"
        :on-success="handleUploadSuccess"
      >
        <el-button size="small" type="primary">批量导入</el-button>
      </el-upload>
      <el-button
        size="small"
        type="danger"
        class="batch-delete"
        @click="bacthDelete"
        :disabled="multipleSelection.length === 0"
        >批量删除</el-button
      >
      <el-button
        size="small"
        type="warning"
        @click="bacthAudit"
        :disabled="multipleSelection.length === 0"
        >批量审核</el-button
      >
      <el-button size="small" type="success" @click="download"
        >模板下载</el-button
      >
    </div>
    <div class="table-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        :row-style="rowStyle"
        :cell-style="cellStyle"
        :header-row-style="headerRowStyle"
        :header-cell-style="headerCellStyle"
        :highlight-current-row="false"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column> -->
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="区域" prop="areaName" />
        <el-table-column label="服刑人员" prop="fxName"></el-table-column>
        <el-table-column label="家属姓名" prop="memberName"> </el-table-column>
        <el-table-column label="家属人数" prop="memberNumber">
        </el-table-column>
        <el-table-column label="一级关系" prop="memberRelationLv1" />
        <el-table-column label="二级关系" prop="memberRelationLv2" />
        <el-table-column label="身份证号码" width="180" prop="memberPID" />
        <el-table-column label="家属号码" width="120" prop="memberPhoneCode" />
        <el-table-column label="状态" prop="verifyStatusMsg"> </el-table-column>
        <el-table-column label="审核用户" prop="verifyUser" />
        <el-table-column label="审核时间" width="150" prop="verifyTime" />
        <el-table-column label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="openDialog(scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        @size-change="getTableList"
        @current-change="getTableList"
        :current-page.sync="pageOptions.page"
        :page-size="pageOptions.size"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <detail ref="detail" :rowData="rowData" @reload="getTableList" />
  </div>
</template>

<script>
import detail from './components/detail'
import { getToken } from '@/utils/auth'
const path = require('path')
const statusObj = {
  0: '未审核',
  1: '审核通过',
  '-1': '审核拒绝',
  '-2': '取消审核'
}
export default {
  components: { detail },
  data() {
    return {
      statusObj,
      list: null,
      listLoading: true,
      headerRowStyle: {
        fontSize: '13px',
        color: '#7B94BC',
        fontWeight: 600,
        height: '48px'
      },
      headerCellStyle: {
        background: 'rgba(37,61,147,0.05)',
        textAlign: 'center'
      },
      rowStyle: {
        fontSize: '13px',
        color: '#4A4A4A;',
        height: '48px'
      },
      cellStyle: {
        textAlign: 'center'
      },
      rowData: {},
      pageOptions: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      searchForm: {
        prisonName: '',
        fxName: '', //服刑人员姓名 空: 不配置姓名
        areaName: '', // 区域 all:全部, 其他值对应的监区, 此处的值要求是登录用户可管理的监区.
        verifyStatus: ''
      },
      areaList: [],
      prisonList: [],
      prisonId: sessionStorage.getItem('prisonId'),
      extraParams: {
        prisonId: sessionStorage.getItem('prisonId'),
        isHaveOperatorManager: false
      },
      uploadUrl: process.env.VUE_APP_BASE_API + '/upload/upload-excel',
      uploadHeader: {
        Authorization: 'Bearer ' + getToken()
      },
      multipleSelection: [],
      timer: null
    }
  },
  computed: {
    userInfo() {
      return JSON.parse(sessionStorage.getItem('userInfo'))
    }
  },
  created() {
    this.getTableList()
    this.getAreaList()
    this.userInfo.isSuper && this.getPrisonList()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    download() {
      const anchor = document.createElement('a')
      anchor.href = path.join('./xlsx/member-info.xlsx')
      anchor.setAttribute('download', '家属信息.xlsx')
      anchor.innerHTML = '下载中...'
      anchor.style.display = 'none'
      document.body.appendChild(anchor)
      debugger
      anchor.click()
      document.body.removeChild(anchor)
      this.timer = setTimeout(() => {
        URL.revokeObjectURL(anchor.href)
      }, 250)
    },
    bacthDelete() {
      const pids = this.multipleSelection.map(item => item.memberPID)
      this.$confirm('此操作将批量删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$api.memberDelete({
          pid: pids,
          prisonId: this.prisonId,
          fxId: ''
        })
        this.$message.success('操作成功')
        this.getTableList()
      })
    },
    bacthAudit() {
      const pids = this.multipleSelection.map(item => {
        return {
          prisonId: this.prisonId,
          fxId: item.fxId,
          pid: item.memberPID
        }
      })
      this.$confirm('此操作将批量审核选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$api.memberAccept(pids)
        this.$message.success('操作成功')
        this.getTableList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async getPrisonList() {
      const res = await this.$api.getPrisonList()
      this.prisonList = res
    },
    handleBeforeUpload(file) {},
    handleUploadSuccess(res) {
      if (res.code === 0) {
        const result = res.result
        if (result.failed.length !== 0) {
          let str = `共上传${result.total}条数据，成功${result.success}条，其中<br/>`
          str = str + result.failed.join('<br/>')
          this.getTableList()
          return this.$message({
            dangerouslyUseHTMLString: true,
            message: str,
            type: 'warning'
          })
        }
        this.getTableList()
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.msg)
      }
    },
    handlePrisonChange(val) {
      const prisonItem = this.prisonList.find(item => item.prisonName === val)
      this.prisonId = prisonItem.prisonId
      this.getAreaList()
    },
    async getAreaList() {
      const res = await this.$api.getAreaList({ prisonId: this.prisonId })
      this.areaList = res
    },
    getTableList(searchAllFlag) {
      this.listLoading = true
      let params = {}
      if (typeof searchAllFlag === 'boolean') {
        params = {
          fxName: '',
          areaName: '',
          verifyStatus: '',
          page: 1,
          pageSize: 10,
          prisonId: this.prisonId
        }
      } else {
        params = {
          ...this.pageOptions,
          prisonId: this.prisonId,
          ...this.searchForm
        }
      }
      try {
        this.$api.getMemberList(params).then(res => {
          this.list = res.list
          this.total = res.total
        })
      } finally {
        this.listLoading = false
      }
    },
    async openDialog(row) {
      const res = await this.$api.getMemberDetail({
        prisonId: this.prisonId, //监狱ID
        areaName: row.areaName, //监区ID
        fxName: row.fxName, //服刑人姓名
        fxId: row.fxId, //囚号
        memberPID: row.memberPID // 家属身份号码
      })
      this.rowData = res
      this.$refs.detail.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-box {
  margin-top: -10px;
  margin-bottom: 12px;
  display: flex;
  .batch-delete {
    margin-left: 10px;
  }
}
.pagination-container {
  margin: 15px;
  text-align: right;
}
.search-form {
  .el-form {
    ::v-deep .el-form-item {
      margin-right: 32px;
      .el-form-item__label {
        font-weight: 600;
        font-size: 13px;
      }
      .el-input__inner {
        height: 28px;
        width: 160px;
        font-size: 13px;
      }
      .el-form-item__content {
        height: 28px;
      }
      button {
        height: 28px;
        padding: 4px 12px;
        font-size: 13px;
        font-weight: 400;
      }
    }
  }
}
</style>
