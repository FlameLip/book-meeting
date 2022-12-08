<template>
  <div class="call-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="通话日" name="1">
        <div class="call-day-container" v-loading="callLoading">
          <ul class="table-list">
            <li v-for="(item, index) in weekMap" :key="index">
              <div class="table-header">{{ item }}</div>
              <div class="area-box">
                {{
                  weekdayAreaInfo[index].length
                    ? weekdayAreaInfo[index]
                        .map(item => item.areaName)
                        .join('、')
                    : ''
                }}
              </div>
              <div class="operate-box">
                <el-button type="text" @click="openEditDialog(index)"
                  >编辑</el-button
                >
              </div>
            </li>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="节假日及串休" name="2">
        <div class="holiday-container">
          <div class="search-form">
            <el-form
              :inline="true"
              :model="searchForm"
              ref="searchForm"
              :rules="rules"
              label-position="right"
            >
              <el-form-item label="日期" prop="day">
                <el-date-picker
                  v-model="searchForm.day"
                  type="dates"
                  style="width: 160px"
                  format="yyyy.MM.dd"
                  value-format="yyyy.MM.dd"
                  :picker-options="pickerOptions"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select v-model="searchForm.type">
                  <el-option label="工作" value="work"></el-option>
                  <el-option label="休息" value="rest"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="参照" prop="link">
                <el-select v-model="searchForm.link">
                  <el-option
                    v-for="(item, index) in weekMap"
                    :key="index"
                    :label="item"
                    :value="index"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="setHolidayConfig('add')"
                  >添加</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <div class="table-container">
            <el-table
              v-loading="holidayLoading"
              :data="holidayData"
              border
              :row-style="rowStyle"
              :cell-style="cellStyle"
              :header-row-style="headerRowStyle"
              :header-cell-style="headerCellStyle"
              :highlight-current-row="false"
            >
              <el-table-column label="日期" prop="day" />
              <el-table-column label="类型" prop="type">
                <template slot-scope="scope">
                  <span>{{ scope.row.type === 'work' ? '工作' : '休息' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="参照" prop="link">
                <template slot-scope="scope">
                  {{ weekMap[scope.row.link] }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div class="operate-td">
                    <el-select
                      v-model="scope.row.editLink"
                      style=""
                      v-if="scope.row.type === 'work'"
                    >
                      <el-option
                        v-for="(item, index) in weekMap"
                        :key="index"
                        :label="item"
                        :value="index"
                      >
                      </el-option>
                    </el-select>
                    <el-button
                      size="mini"
                      type="primary"
                      @click="setHolidayConfig('edit', scope.row)"
                      v-if="scope.row.type === 'work'"
                      >更新</el-button
                    >
                    <el-button
                      size="mini"
                      type="danger"
                      @click="deleteHolidayConfig(scope.row)"
                      >删除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <update-week
      ref="updateWeek"
      :weekDay="weekDay"
      @submit="getWeekdayAreaInfo"
      :weekdayAreaInfo="weekdayAreaInfo"
    />
  </div>
</template>

<script>
import updateWeek from './components/update-week.vue'
import { cloneDeep } from 'lodash'
const weekMap = {
  monday: '周一',
  tuesday: '周二',
  wednesday: '周三',
  thursday: '周四',
  friday: '周五',
  saturday: '周六',
  sunday: '周日'
}
export default {
  components: { updateWeek },
  data() {
    return {
      rules: {
        link: [
          {
            required: true,
            message: '请选择参考',
            trigger: 'change'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }
        ],
        day: [
          {
            type: 'array',
            required: true,
            message: '请至少一个日期',
            trigger: 'change'
          }
        ]
      },
      activeName: '1',
      weekMap,
      weekDay: '',
      weekdayAreaInfo: {
        prisonId: '', // 监狱ID
        startTime: '10:00', // 可为空, 为空不修改配置
        endTime: '22:00', //可为空, 为空不修改配置
        monday: ['监区1', '监区2', '监区3'],
        tuesday: [], //周二监区
        wednesday: [], //周三监区
        thursday: [], //周四监区
        friday: [], //周五监区
        saturday: [], //周六监区
        sunday: [] //周天监区
      },
      searchForm: {
        day: '',
        link: '',
        type: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 3600 * 1000
        }
      },
      holidayLoading: false,
      callLoading: false,
      holidayData: [],
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
      }
    }
  },
  mounted() {
    this.getWeekdayAreaInfo()
    this.getHolidayConfig()
  },
  methods: {
    cloneDeep,
    handleClick(tab, event) {
      if (tab === '1') {
        this.getWeekdayAreaInfo()
      } else {
        this.getHolidayConfig()
      }
    },
    openEditDialog(index) {
      this.weekDay = index
      this.$refs.updateWeek.dialogVisible = true
    },
    async getWeekdayAreaInfo() {
      try {
        this.callLoading = true
        // const res = await this.$api.getWeekdayAreaInfo({ prisonId: '' })
        const res = {
          startTime: '09:00',
          endTime: '22:00',
          monday: [
            {
              areaId: 'area1',
              areaName: '监区1'
            },
            {
              areaId: 'area2',
              areaName: '监区1'
            },
            {
              areaId: 'area3',
              areaName: '监区1'
            },
            {
              areaId: 'area4',
              areaName: '监区1'
            },
            {
              areaId: 'area5',
              areaName: '监区1'
            }
          ],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        }
        this.weekdayAreaInfo = res
      } finally {
        this.callLoading = false
      }
    },
    async getHolidayConfig() {
      try {
        this.holidayLoading = true
        // const res = await this.$api.getHolidayConfig({prisonId: ''})
        const res = {
          total: 100,
          list: [
            {
              day: '2022.12.02',
              type: 'rest', // 类型, work:工作, rest:休息
              link: 'monday'
            },
            {
              day: '2022.12.02',
              type: 'work', // 类型, work:工作, rest:休息
              link: 'tuesday'
            },

            {
              day: '2022.12.02',
              type: 'work', // 类型, work:工作, rest:休息
              link: 'monday'
            }
          ]
        }
        this.holidayData = res.list
        this.holidayData.forEach(item => this.$set(item, 'editLink', item.link))
      } finally {
        this.holidayLoading = false
      }
    },
    async setHolidayConfig(type, data) {
      let setting = {}
      if (type === 'add') {
        setting = { ...this.searchForm }
        this.$refs.searchForm.validate(async valid => {
          if (!valid) return
          await this.$api.setHolidayConfig({ prisonId: '', setting })
          this.$message.success('操作成功')
          this.getHolidayConfig()
        })
      } else {
        setting = {
          day: data.day,
          type: data.type,
          link: data.editLink
        }
        await this.$api.setHolidayConfig({ prisonId: '', setting })
        this.$message.success('操作成功')
        this.getHolidayConfig()
      }
    },
    deleteHolidayConfig(data) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$api.setHolidayConfig({ prisonId: '', day: data.day })
        this.$message.success('操作成功')
        this.getHolidayConfig()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-list {
  border: 1px solid rgba(238, 238, 238, 1);
  border-bottom: none;
  margin-top: 25px;
  li {
    height: 60px;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    display: flex;
    & > div {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .table-header {
      font-size: 13px;
      color: #7b94bc;
      background: #f5f6fa;
      text-align: center;
      font-weight: 600;
      border-right: 1px solid rgba(238, 238, 238, 1);
      width: 100px;
    }
    .area-box {
      display: block;
      padding: 11px 20px;
      font-size: 13px;
      color: #4a4a4a;
      border-right: 1px solid rgba(238, 238, 238, 1);
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .operate-box {
      width: 100px;
      button {
        font-size: 13px;
      }
    }
  }
}

.operate-td {
  display: flex;
  justify-content: center;
  ::v-deep .el-select {
    margin-right: 10px;
    height: 32px;
    width: 98px;
    .el-input--suffix {
      height: 38px;
      width: 98px;
      input {
        height: 32px;
        width: 98px;
      }
    }
  }
}
</style>