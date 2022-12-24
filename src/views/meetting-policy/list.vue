<template>
  <div class="app-container">
    <div class="call-container">
      <div class="module-title">
        <h3>通话政策</h3>
      </div>
      <div class="search-form">
        <el-form
          ref="callForm"
          :rules="callRules"
          :inline="true"
          :model="callForm"
        >
          <el-form-item prop="timesPerMonth" label="每月视频通话次数">
            <el-input-number
              v-model="callForm.timesPerMonth"
              :controls="false"
              :min="1"
              :max="999"
            ></el-input-number>
            <span style="margin-left: -10px">次</span>
          </el-form-item>
          <el-form-item prop="numberPerMeeting" label="每次通话人数">
            <el-input-number
              v-model="callForm.numberPerMeeting"
              :controls="false"
              :min="1"
              :max="999"
            ></el-input-number>
            <span style="margin-left: -10px">人</span>
          </el-form-item>
          <el-form-item prop="minutePerMeeting" label="每次视频通话时长">
            <el-input-number
              v-model="callForm.minutePerMeeting"
              :controls="false"
              :min="1"
              :max="999"
            ></el-input-number>
            <span style="margin-left: -10px">分钟</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addMeetingRule">应用</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="table-container">
      <div class="search-form">
        <el-form
          ref="unusualForm"
          :rules="unusualRules"
          :inline="true"
          :model="unusualForm"
        >
          <el-form-item prop="phoneCode" label="特批账户">
            <el-input v-model="unusualForm.phoneCode"></el-input>
          </el-form-item>
          <el-form-item prop="minutePerMeeting" label="每次通话人数">
            <el-input-number
              v-model="unusualForm.minutePerMeeting"
              :controls="false"
              :min="1"
              :max="999"
            ></el-input-number>
            <span style="margin-left: -10px">分钟</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="unusualConfig">添加</el-button>
          </el-form-item>
        </el-form>
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
          <el-table-column align="center" label="序号">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="phoneCode" />
          <el-table-column label="最大通话时长" prop="minutePerMeeting">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="text"
                @click="deletePhone(scope.row)"
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
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      callForm: {
        timesPerMonth: 0, // 每月视频通话次数
        numberPerMeeting: 0, // 每次通话人数
        minutePerMeeting: 0 // 每次通话时长(分钟)
      },
      unusualForm: {
        phoneCode: '', //手机号
        minutePerMeeting: 0 // 最大通话时长
      },
      unusualRules: {
        phoneCode: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'change'
          }
        ],
        minutePerMeeting: [
          {
            required: true,
            message: '请输入最大通话时长',
            trigger: 'change'
          }
        ]
      },
      callRules: {
        timesPerMonth: [
          {
            required: true,
            message: '请输入每月视频通话次数',
            trigger: 'change'
          }
        ],
        numberPerMeeting: [
          {
            required: true,
            message: '请输入每次通话人数',
            trigger: 'change'
          }
        ],
        minutePerMeeting: [
          {
            required: true,
            message: '每次视频通话时长',
            trigger: 'change'
          }
        ]
      },
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
      pageOptions: {
        page: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  computed: {
    prisonId() {
      return sessionStorage.getItem('prisonId')
    }
  },
  created() {
    this.getMeetingRule()
    this.getList()
  },
  mounted() {
    document.querySelector('.app-main').style.backgroundColor = '#F5F7FF'
    document.querySelector('.app-main').style.padding = '0px'
  },
  beforeDestroy() {
    document.querySelector('.app-main').style.backgroundColor = '#fff'
    document.querySelector('.app-main').style.padding = '20px 24px 0 24px'
  },
  methods: {
    async getMeetingRule() {
      const res = await this.$api.getMeetingRule({ prisonId: this.prisonId })
      this.callForm = res
    },
    addMeetingRule() {
      this.$refs.callForm.validate(async valid => {
        if (!valid) return
        const res = await this.$api.addMeetingRule({
          prisonId: this.prisonId,
          ...this.callForm
        })
        this.$message.success('应用成功')
      })
    },
    unusualConfig() {
      this.$refs.unusualForm.validate(async valid => {
        if (!valid) return
        const res = await this.$api.unusualConfig({
          prisonId: this.prisonId,
          ...this.unusualForm
        })
        this.$message.success('添加成功')
        this.getList()
      })
    },
    getList() {
      try {
        this.listLoading = true
        const params = { ...this.pageOptions, prisonId: this.prisonId }
        this.$api.unusualList(params).then(res => {
          this.list = res.list
          this.total = res.total
        })
      } finally {
        this.listLoading = false
      }
    },
    deletePhone(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$api.deleteUnusual({ phoneCode: row.phoneCode })
        this.$message.success('删除成功!')
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  overflow: hidden;
}
.call-container {
  margin-bottom: 12px;
  border-radius: 6px;
  padding: 24px 24px 8px 24px;
  background-color: #fff;
}
.table-container {
  padding: 24px;
  height: calc(100% - 132px);
  border-radius: 6px;
  background-color: #fff;
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
