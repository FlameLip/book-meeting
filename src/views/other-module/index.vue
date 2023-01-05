<template>
  <div class="app-container">
    <div class="module-title">
      <h3>身份认证SIM卡</h3>
    </div>
    <div class="table-top-button">
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
        type="success"
        class="add-btn"
        @click="handleOpenAdd"
        >新增</el-button
      >
      <el-button
        size="small"
        type="danger"
        @click="bacthDelete"
        :disabled="multipleSelection.length === 0"
        >批量删除</el-button
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
        @selection-change="handleSelectionChange"
        :highlight-current-row="false"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="电话卡号" prop="phoneCode"></el-table-column>
        <el-table-column label="身份证号码" width="240" prop="pid">
        </el-table-column>
        <el-table-column label="关联服刑人员" prop="fxName"> </el-table-column>
        <el-table-column label="关系" prop="relation"> </el-table-column>
        <el-table-column label="运营商" prop="operator"> </el-table-column>
        <el-table-column label="客户经理" prop="manager"> </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="openDialog(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        @size-change="getList"
        @current-change="getList"
        :current-page.sync="pageOptions.page"
        :page-size="pageOptions.size"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <edit ref="edit" :rowData="rowData" @reload="getList" />
    <add ref="add" :rowData="rowData" @reload="getList" />
  </div>
</template>

<script>
import edit from './components/edit'
import add from './components/add'
import { getToken } from '@/utils/auth'
export default {
  components: { edit, add },
  data() {
    return {
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
      extraParams: {
        prisonId: sessionStorage.getItem('prisonId'),
        isHaveOperatorManager: true,
        excel: ''
      },
      uploadUrl: process.env.VUE_APP_BASE_API + '/upload/upload-excel',
      uploadHeader: {
        Authorization: 'Bearer ' + getToken()
      },
      multipleSelection: []
    }
  },
  created() {
    this.getList()
  },
  computed: {
    prisonId() {
      return sessionStorage.getItem('prisonId')
    }
  },
  methods: {
    handleOpenAdd() {
      this.$refs.add.dialogVisible = true
    },
    bacthDelete() {
      const phoneCodes = this.multipleSelection.map(item => item.phoneCode)
      this.$confirm('此操作将删除选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$api.deletePhoneCodeWhite({
          phoneCode: phoneCodes,
          prisonId: this.prisonId
        })
        this.$message.success('操作成功')
        this.getList()
      })
    },
    handleBeforeUpload(file) {
      this.extraParams.excel = file
    },
    handleUploadSuccess(res) {
      if (res.code === 0) {
        const result = res.result
        if (result.failed.length !== 0) {
          let str = `共上传${result.total}条数据，成功${result.success}条，其中<br/>`
          str = str + result.failed.join('<br/>')
          this.getList()
          return this.$message({
            dangerouslyUseHTMLString: true,
            message: str,
            type: 'warning'
          })
        }
        this.getList()
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.msg)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      try {
        this.listLoading = true
        const params = {
          ...this.pageOptions,
          prisonId: this.prisonId
        }
        this.$api.getPhoneCodeWhiteList(params).then(res => {
          this.list = res.list
          this.total = res.total
        })
      } finally {
        this.listLoading = false
      }
    },
    openDialog(row) {
      this.rowData = row
      this.$refs.edit.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  margin: 15px;
  text-align: right;
}
.module-title {
  margin-bottom: 24px;
  h3 {
    font-size: 15px;
    color: #4985e1;
    line-height: 14px;
    font-weight: 400;
  }
}
.table-top-button {
  display: flex;
  margin: 10px 0px;
  .add-btn {
    margin-left: 10px;
  }
}
</style>
