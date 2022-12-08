<template>
  <div class="app-container">
    <div class="btn-container">
      <el-button type="success" class="add-user-btn" @click="openDialog">
        <i class="el-icon-circle-plus el-icon--left"></i>
        添加用户
      </el-button>
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
      >
        <el-table-column label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="uname" width="180" />
        <el-table-column label="审核权限" width="130" prop="verifyLv">
          <template slot-scope="scope">
            <span>{{ verifyObj[scope.row.verifyLv] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="控制安全级别" width="120" prop="isSafety">
          <template slot-scope="scope">
            {{ scope.row.isSafety ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="管理区域" prop="manageAreaStr">
          <template slot-scope="scope">
            {{ scope.row.manageAreaStr }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="openDialog(scope.row)"
              >编辑</el-button
            >
            <el-button size="small" type="text" @click="deleteUser(scope.row)"
              >删除</el-button
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
    <add-user ref="addUser" :rowData="rowData" />
  </div>
</template>

<script>
import addUser from './components/add-user'
import { cloneDeep } from 'lodash'

const verifyObj = {
  'verify-lv1': '初审',
  'verify-lv2': '终审'
}
export default {
  components: { addUser },
  data() {
    return {
      list: null,
      listLoading: true,
      verifyObj,
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
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      try {
        this.listLoading = true
        let params = { ...this.pageOptions, prisonId: '' }
        this.$api.getUserList(params).then(res => {
          this.list = res.list
          this.total = res.total
          this.list.forEach(
            item =>
              (item.manageAreaStr = item.manageAreaList
                .map(_item => _item.name)
                .join('、'))
          )
        })
      } finally {
        this.listLoading = false
      }
    },
    openDialog(row) {
      if (row.uname) {
        this.rowData = cloneDeep(row)
      } else {
        this.rowData = {}
      }
      this.$refs.addUser.dialogVisible = true
    },
    deleteUser(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$api.deleteUser({ uname: row.uname })
        this.$message.success('删除成功!')
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  margin: 15px;
  text-align: right;
}
.add-user-btn {
  margin-bottom: 16px;
}
</style>
