<template>
  <div class="app-container">
    <div class="search-form">
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchForm"
        label-position="right"
      >
        <el-form-item label="姓名" prop="fxName">
          <el-input v-model="searchForm.fxName"></el-input>
        </el-form-item>
        <el-form-item label="区域" prop="areaId">
          <el-select v-model="searchForm.areaId">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通话政策" prop="isMeetingPolicy">
          <el-select v-model="searchForm.isMeetingPolicy">
            <el-option label="满足" :value="1"></el-option>
            <el-option label="不满足" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="verifyLv">
          <el-select v-model="searchForm.verifyLv">
            <el-option label="满足" :value="1"></el-option>
            <el-option label="不满足" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button type="primary" @click="getList(true)">查询全部</el-button>
        </el-form-item>
      </el-form>
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
              >查看详情</el-button
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
    <detail ref="detail" :rowData="rowData" />
  </div>
</template>

<script>
import detail from './components/detail'
import { cloneDeep } from 'lodash'

const verifyObj = {
  'verify-lv1': '初审',
  'verify-lv2': '终审'
}
export default {
  components: { detail },
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
      total: 0,
      searchForm: {
        fxName: '', //服刑人员姓名 空: 不配置姓名
        areaId: '', // 区域 all:全部, 其他值对应的监区, 此处的值要求是登录用户可管理的监区.
        isMeetingPolicy: '', // 是否满足通话政策, 字符串 all:全部, 1:满足, 0:不满足
        verifyLv: '', // 审核状态, all:全部, 其他值为`审核权限列表`
        isToday: 0 // 是否当日审核 0:否, 1:是
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(searchAllFlag) {
      this.listLoading = true
      let params = {}
      if (searchAllFlag) {
        params = {
          fxName: '',
          areaId: '',
          isMeetingPolicy: '',
          verifyLv: '',
          isToday: 0,
          page: 1,
          pageSize: 10,
          prisonId: ''
        }
      } else {
        params = { ...this.pageOptions, prisonId: '', ...this.searchForm }
      }
      try {
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
      this.rowData = cloneDeep(row)
      this.$refs.detail.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
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
