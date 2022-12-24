<template>
  <div class="app-container">
    <div class="module-title">
      <h3>身份认证SIM卡</h3>
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
    <edit ref="edit" :rowData="rowData" />
  </div>
</template>

<script>
import edit from './components/edit'
import { cloneDeep } from 'lodash'
export default {
  components: { edit },
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
      total: 0
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
      this.rowData = cloneDeep(row)
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
</style>
