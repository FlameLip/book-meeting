<template>
  <div class="app-container">
    <div class="search-form">
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchForm"
        label-position="right"
      >
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
        <el-form-item label="通话政策" prop="isMeetingPolicy">
          <el-select v-model="searchForm.isMeetingPolicy" clearable>
            <el-option label="满足" :value="1"></el-option>
            <el-option label="不满足" :value="0"></el-option>
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
        <el-table-column label="区域" prop="areaName" />
        <el-table-column label="服刑人员姓名" prop="fxName"></el-table-column>
        <el-table-column label="满足通话政策" prop="isMeetingPolicyMsg">
        </el-table-column>
        <el-table-column label="家属人数" prop="memberNumber">
        </el-table-column>
        <el-table-column label="关系" prop="memberRelation" />
        <el-table-column label="家属号码" prop="memberPhoneCode" />
        <el-table-column label="状态" prop="verifyStatusMsg"> </el-table-column>
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
    <detail
      ref="detail"
      type="audit"
      :rowData="rowData"
      :prisonId="prisonId"
      @reload="getList"
    />
  </div>
</template>

<script>
import detail from '../apply-list/components/detail'

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
      rowData: {
        members: [
          {
            memberPID: 'xxxxxxxx', // 身份证号
            memberRelation: '父子', //家属关系
            memberType: '直系亲属', //关系关型
            censusRegister: '云南昆明', // 户籍
            gender: '男', // 性别
            address: 'xxxxx', // 家庭住址
            memberPIDImgZUrl: 'http://xxxx/xxxxx', // 家属身份证正面url
            memberPIDImgBUrl: 'http://xxxx/xxxxx' // 家属身份证背面url
          }
        ]
      },
      pageOptions: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      searchForm: {
        fxName: '', //服刑人员姓名 空: 不配置姓名
        areaName: '', // 区域 all:全部, 其他值对应的监区, 此处的值要求是登录用户可管理的监区.
        verifyStatus: '',
        isMeetingPolicy: '',
        isToday: true
      },
      areaList: []
    }
  },
  created() {
    this.getList()
    this.getAreaList()
  },
  computed: {
    prisonId() {
      return sessionStorage.getItem('prisonId')
    }
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
          fxName: '',
          areaId: '',
          isMeetingPolicy: '',
          verifyStatus: '',
          isToday: true,
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
        this.$api.getApplyList(params).then(res => {
          this.list = res.list
          this.total = res.total
        })
      } finally {
        this.listLoading = false
      }
    },
    async openDialog(row) {
      const res = await this.$api.getApplyDeteil({
        prisonId: this.prisonId,
        meetingId: row.meetingId
      })
      this.rowData = res
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
