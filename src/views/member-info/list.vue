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
          <el-select v-model="searchForm.areaName">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="verifyStatus">
          <el-select v-model="searchForm.verifyStatus">
            <el-option
              v-for="(item, index) in statusObj"
              :label="item"
              :key="index"
              :value="+index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openDialog">查询</el-button>
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
        <el-table-column label="家属姓名" prop="memberName"> </el-table-column>
        <el-table-column label="家属人数" prop="memberNumber">
        </el-table-column>
        <el-table-column label="一级关系" prop="memberRelationLv1" />
        <el-table-column label="二级关系" prop="memberRelationLv2" />
        <el-table-column label="身份证号码" width="180" prop="memberPID" />
        <el-table-column label="家属号码" prop="memberPhoneCode" />
        <el-table-column label="状态" prop="verifyStatusMsg"> </el-table-column>
        <el-table-column label="审核用户" prop="verifyUser" />
        <el-table-column label="审核时间" prop="verifyTime" />
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
    <detail ref="detail" :rowData="rowData" @reload="getList" />
  </div>
</template>

<script>
import detail from './components/detail'

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
        fxName: '', //服刑人员姓名 空: 不配置姓名
        areaName: '', // 区域 all:全部, 其他值对应的监区, 此处的值要求是登录用户可管理的监区.
        verifyStatus: ''
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
      if (typeof searchAllFlag === 'boolean') {
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
        this.$api.getMemberList(params).then(res => {
          this.list = res.list
          this.total = res.total
        })
      } finally {
        this.listLoading = false
      }
    },
    openDialog(row) {
      // this.rowData = cloneDeep(row)
      this.rowData = {
        areaName: '一监区',
        fxId: 'xxx', // 囚号
        fxName: '张三', // 服刑人员姓名
        fxProfilePhotoUrl: require('../../assets/bg.png'), // 服刑人员头像Url
        memberName: '张二', // 家属姓名
        memberProfilePhotoUrl: require('../../assets/bg.png'), //家属头像Url
        memberRelation: '父子', // 家属关系
        gender: '男', // 家属性别
        memberPhoneCode: 'xxxxxxx', // 家属电话号码
        memberPID: 'xxxxxx', // 身份号码
        issuingAuthority: 'xxxx', // 签发机关
        validPeriod: '2015.08.09-2035.08.09', // 有效期限
        address: 'xxxxxxx', // 家庭住址
        memberPIDImgZUrl: require('../../assets/bg.png'), // 家属身份证正面url
        memberPIDImgBUrl: require('../../assets/bg.png'), // 家属身份证背面url
        assistImgUrl: require('../../assets/bg.png'), // 辅助证明
        verifyStatus: 0, // 审核状态, 0:未审核, 1:审核通过 -1:审核拒绝 -2:取消审核
        verifyStatusMsg: '未审核', // 未审核, 审核通过, 审核拒绝
        verifyUser: '管理员', // 审核用户
        verifyTime: '2022.08.09 22:00' //审核时间
      }
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
