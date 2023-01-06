<template>
  <div class="app-container">
    <div class="search-form">
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchForm"
        label-position="right"
      >
        <!-- <el-form-item label="服刑人员姓名" prop="fxName">
          <el-input v-model="searchForm.fxName"></el-input>
        </el-form-item> -->
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
        <el-form-item label="日期" prop="meetingDate">
          <el-date-picker
            v-model="searchForm.meetingDate"
            type="date"
            format="yyyy.MM.dd"
            value-format="yyyy.MM.dd"
            placeholder="选择日期"
          >
          </el-date-picker>
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
        <!-- <el-table-column label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column> -->
        <el-table-column label="家属姓名" prop="memberName" />
        <el-table-column label="服刑人员姓名" prop="fxName"></el-table-column>
        <el-table-column label="会见日期" prop="meetingDate" />
        <el-table-column label="会见时间段" prop="startTime">
          <template slot-scope="scope">
            {{
              scope.row.startTime && scope.row.endTime
                ? scope.row.startTime + ' - ' + scope.row.endTime
                : '待安排'
            }}
          </template>
        </el-table-column>
        <el-table-column label="会见室" prop="windowName">
          <template slot-scope="scope">
            {{ scope.row.windowName ? scope.row.windowName : '待安排' }}
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="order">
          <template slot-scope="scope">
            {{ scope.row.order ? scope.row.order : '待安排' }}
          </template>
        </el-table-column>
        <el-table-column label="囚号" prop="meetingId" />
        <el-table-column label="状态" prop="verifyStatusMsg"> </el-table-column>
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
  </div>
</template>

<script>
import edit from './components/edit'
import { cloneDeep } from 'lodash'
import { parseTime } from '@/utils/index'
import dayjs from 'dayjs'
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
      total: 0,
      searchForm: {
        areaName: '', // 区域 all:全部, 其他值对应的监区, 此处的值要求是登录用户可管理的监区.
        meetingDate: dayjs().format('YYYY.MM.DD')
      },
      areaList: []
    }
  },
  computed: {
    prisonId() {
      return sessionStorage.getItem('prisonId')
    }
  },
  created() {
    // TODO 搜索需要valid
    this.getList()
    this.getAreaList()
  },
  methods: {
    async getAreaList() {
      const res = await this.$api.getAreaList({ prisonId: this.prisonId })
      this.areaList = res
    },
    getList(searchAllFlag) {
      this.listLoading = true
      let params = {}
      if (typeof searchAllFlag === 'boolean') {
        params = {
          areaName: '',
          meetingDate: '2022.12.21',
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
        this.$api.getMettingArrangeList(params).then(res => {
          this.list = res.list
          this.total = res.total
        })
      } finally {
        this.listLoading = false
      }
    },
    async openDialog(row) {
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
.search-form {
  .el-form {
    ::v-deep .el-form-item {
      margin-right: 32px;
      .el-form-item__label {
        font-weight: 600;
        font-size: 13px;
      }
      .el-date-editor {
        width: 160px;
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
