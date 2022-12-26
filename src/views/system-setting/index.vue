<template>
  <div class="system-container">
    <div class="base-setting step-container" v-if="activePage === 1">
      <div class="step-title">
        <span class="circle"></span>
        <span>基础设置（1/5）</span>
      </div>
      <div class="step-content">
        <!--联动选择省份后选择城市-->
        <el-form
          ref="baseForm"
          :rules="baseRules"
          :inline="true"
          :model="baseForm"
        >
          <!-- <el-form-item label="省份" prop="province">
            <el-select
              style="width: 150px"
              v-model="baseForm.province"
              placeholder="请选择省份"
              @change="getProv"
            >
              <el-option
                v-for="item in provinceList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市" prop="city">
            <el-select
              style="width: 150px"
              :disabled="!baseForm.province"
              v-model="baseForm.city"
              placeholder="请选择城市"
            >
              <el-option
                v-for="item in chooseCityList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="单位" prop="prisonName">
            <el-select
              style="width: 150px"
              v-model="baseForm.prisonName"
              placeholder="请选择单位"
              @change="changePrison"
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
          <el-form-item prop="maxMeetingTimes">
            <div slot="label" class="max-label">
              <span>每日允许的登记人数</span>
              <span>建议窗口数量*8</span>
            </div>
            <el-input-number
              style="width: 80px"
              v-model="baseForm.maxMeetingTimes"
              plcaeholder="请输入人数"
              :controls="false"
              :min="1"
              :max="999"
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="openEditPrison">编辑</el-button>
            <el-button type="primary" @click="openAddPrison">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="step-title">
        <span class="circle"></span>
        <span>区域设置（2/5）</span>
      </div>
      <div class="step-content">
        <el-form
          :inline="true"
          :rules="areaRules"
          :model="areaForm"
          ref="areaForm"
        >
          <el-form-item label="区域名称" prop="name">
            <el-input
              v-model="areaForm.name"
              placeholder="请输入区域名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="会见室数量" prop="windowNums">
            <el-input-number
              style="width: 80px"
              v-model="areaForm.windowNums"
              plcaeholder="请输入会见室数量"
              :controls="false"
              :min="1"
              :max="999"
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="addArea">添加</el-button>
          </el-form-item>
        </el-form>
        <div class="area-list">
          <el-tag
            :key="area.name"
            v-for="(area, index) in areaList"
            closable
            type="info"
            @close="handleAreaClose(index)"
          >
            {{ `${area.name} | 会见室数量：${area.windowNums}` }}
          </el-tag>
        </div>
      </div>
      <div class="btn-bottom">
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </div>
    </div>

    <div class="step-container" v-if="activePage === 2">
      <div class="step-title">
        <span class="circle"></span>
        <span>通话日设置（3/5）</span>
      </div>
      <div class="call-day-container step-content" v-loading="callLoading">
        <ul class="table-list">
          <li v-for="(item, index) in weekMap" :key="index">
            <div class="table-header">{{ item }}</div>
            <div class="area-box">
              {{
                weekdayAreaInfo[index].length
                  ? weekdayAreaInfo[index].join('、')
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
        <!-- <el-form
          ref="form"
          :model="weekdayAreaInfo"
          :inline="true"
          :rules="rules"
        >
          <el-form-item label="可申请开始时间">
            <el-time-picker
              v-model="weekdayAreaInfo.startTime"
              format="HH:mm"
              value-format="HH:mm"
              style="width: 100px"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item label="可申请结束">
            <el-time-picker
              v-model="weekdayAreaInfo.endTime"
              format="HH:mm"
              value-format="HH:mm"
              style="width: 100px"
            >
            </el-time-picker>
          </el-form-item>
        </el-form> -->
      </div>
      <div class="btn-bottom">
        <el-button type="primary" @click="activePage = 1">上一步</el-button>
        <el-button type="primary" @click="lastStep">下一步</el-button>
      </div>
      <update-week
        ref="updateWeek"
        :weekDay="weekDay"
        :areaList="areaList"
        @submit="updateWeek"
        :weekdayAreaInfo="weekdayAreaInfo"
      />
    </div>

    <div class="step-container" v-if="activePage === 3">
      <div class="step-title">
        <span class="circle"></span>
        <span>通话政策设置（4/5）</span>
      </div>
      <div class="step-content">
        <!--联动选择省份后选择城市-->
        <el-form
          ref="callForm"
          :rules="callRules"
          :inline="true"
          :model="callForm"
        >
          <el-form-item prop="timesPerMonth" label="每月视频通话次数">
            <el-input-number
              style="width: 80px"
              v-model="callForm.timesPerMonth"
              :controls="false"
              :min="1"
              :max="999"
            ></el-input-number>
            <span style="margin-left: 10px">次</span>
          </el-form-item>
          <el-form-item prop="numberPerMeeting" label="每次通话人数">
            <el-input-number
              style="width: 80px"
              v-model="callForm.numberPerMeeting"
              :controls="false"
              :min="1"
              :max="999"
            ></el-input-number>
            <span style="margin-left: 10px">人</span>
          </el-form-item>
          <el-form-item prop="minutePerMeeting" label="每次视频通话时长">
            <el-input-number
              style="width: 80px"
              v-model="callForm.minutePerMeeting"
              :controls="false"
              :min="1"
              :max="999"
            ></el-input-number>
            <span style="margin-left: 10px">分钟</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="step-title">
        <span class="circle"></span>
        <span>排班会见系统设置（5/5）</span>
      </div>
      <div class="step-content">
        <el-form
          :inline="true"
          :rules="composeRules"
          :model="composeForm"
          ref="composeForm"
        >
          <el-form-item label="时间段" prop="startTime">
            <el-col :span="10">
              <el-time-picker
                v-model="composeForm.startTime"
                format="HH:mm"
                value-format="HH:mm"
                style="width: 100px"
              >
              </el-time-picker>
            </el-col>
            <el-col class="line" :span="4">-</el-col>
            <el-col :span="10">
              <el-time-picker
                v-model="composeForm.endTime"
                format="HH:mm"
                value-format="HH:mm"
                style="width: 100px"
              >
              </el-time-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="通话次数">
            <el-input-number
              style="width: 80px"
              v-model="composeForm.meetingTimes"
              plcaeholder="请输入通话次数"
              :controls="false"
              :min="1"
              :max="999"
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="addCompose">添加</el-button>
          </el-form-item>
        </el-form>
        <div class="area-list">
          <el-tag
            :key="index"
            v-for="(compose, index) in composeList"
            closable
            type="info"
            @close="handleComposeClose(index)"
          >
            {{
              `时间段：${compose.startTime}-${compose.endTime} | 通话次数：${compose.meetingTimes}`
            }}
          </el-tag>
        </div>
      </div>
      <div class="btn-bottom">
        <el-button type="primary" @click="activePage = 2">上一步</el-button>
        <el-button type="primary" @click="submit">完成</el-button>
      </div>
    </div>
    <add
      @addPrison="addPrison"
      @reload="getPrisonList"
      ref="addPrison"
      :prisonData="prisonData"
      :prisonId="prisonId"
      :maxMeetingTimes="baseForm.maxMeetingTimes"
    />
  </div>
</template>

<script>
import { provinceList, cityList } from './data'
import { cloneDeep } from 'lodash'
import updateWeek from '../call-arrange/components/update-week.vue'
import add from './components/add'
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
  components: { updateWeek, add },
  data() {
    const validateStartTime = (rule, value, callback) => {
      if (!value || !this.composeForm.endTime) {
        callback(new Error('请选择时间段'))
      }
      callback()
    }
    return {
      weekMap,
      provinceList,
      callLoading: false,
      weekDay: '',
      activePage: 1,
      chooseCityList: [],
      prisonList: [],
      baseForm: {
        province: '',
        city: '',
        prisonName: '',
        maxMeetingTimes: 240
      },
      weekdayAreaInfo: {
        prisonId: '', // 监狱ID
        // startTime: '', // 可为空, 为空不修改配置
        // endTime: '', //可为空, 为空不修改配置
        monday: [],
        tuesday: [], //周二监区
        wednesday: [], //周三监区
        thursday: [], //周四监区
        friday: [], //周五监区
        saturday: [], //周六监区
        sunday: [] //周天监区
      },
      areaForm: {
        name: '',
        windowNums: ''
      },
      callForm: {
        timesPerMonth: '', // 每月视频通话次数
        numberPerMeeting: '', // 每次通话人数
        minutePerMeeting: '' // 每次通话时长(分钟)
      },
      composeForm: {
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        meetingTimes: '' // 通话次数
      },
      baseRules: {
        province: [
          {
            required: true,
            message: '请选择省份',
            trigger: 'change'
          }
        ],
        city: [
          {
            required: true,
            message: '请选择城市',
            trigger: 'change'
          }
        ],
        prisonName: [
          {
            required: true,
            message: '请输入单位名称',
            trigger: 'change'
          }
        ],
        maxMeetingTimes: [
          {
            required: true,
            message: '请输入人数',
            trigger: 'change'
          }
        ]
      },
      areaRules: {
        name: [
          {
            required: true,
            message: '请输入区域名称',
            trigger: 'change'
          }
        ],
        windowNums: [
          {
            required: true,
            message: '请输入会见室数量',
            trigger: 'change'
          }
        ]
      },
      rules: {
        startTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }
        ],
        endTime: [
          {
            required: true,
            message: '请选择结束时间',
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
      composeRules: {
        startTime: [
          {
            validator: validateStartTime,
            trigger: 'change'
          }
        ],
        meetingTimes: [
          {
            required: true,
            message: '请输入通话次数',
            trigger: 'change'
          }
        ]
      },
      areaList: [],
      composeList: [],
      prisonData: {},
      prisonId: ''
    }
  },
  computed: {
    userInfo() {
      return JSON.parse(sessionStorage.getItem('userInfo'))
    }
  },
  mounted() {
    this.initData()
    this.getPrisonList()
    this.getAreaList()
  },
  methods: {
    async addPrison(val) {
      await this.getPrisonList()
      const data = this.prisonList.find(item => item.prisonId === val)
      this.baseForm.city = data.city
      this.baseForm.province = data.province
      this.baseForm.maxMeetingTimes = data.maxMeetingTimes
      this.baseForm.prisonName = data.prisonName
    },
    openEditPrison() {
      this.prisonData = cloneDeep(this.baseForm)
      this.prisonData.prisonId = this.prisonId
      this.$refs.addPrison.dialogVisible = true
    },
    openAddPrison() {
      this.prisonData = {}
      this.$refs.addPrison.dialogVisible = true
    },
    changePrison(val) {
      const item = this.prisonList.find(item => item.prisonName === val)
      this.baseForm.city = item.city
      this.baseForm.province = item.province
      this.baseForm.maxMeetingTimes = item.maxMeetingTimes
      this.prisonId = item.prisonId
      this.getAreaList()
    },
    async getPrisonList() {
      const res = await this.$api.getPrisonList()
      this.prisonList = res
    },
    async initData() {
      this.prisonId = this.userInfo.prisonId
    },
    async getAreaList() {
      const res = await this.$api.getAreaList({ prisonId: this.prisonId })
      this.areaList = res
    },
    getProv(val) {
      this.baseForm.city = ''
      this.chooseCityList = cityList
        .filter(item => item.prov === val)
        .map(item => ({ label: item.label, value: item.label }))
    },
    addArea() {
      console.log(this.$refs.areaForm)
      this.$refs.areaForm.validate(async valid => {
        if (!valid) return
        if (this.areaList.some(item => item.name === this.areaForm.name))
          return this.$message.error('请勿重复添加相同区域名称的监区')
        this.areaList.push(cloneDeep(this.areaForm))
      })
    },
    handleAreaClose(index) {
      this.areaList.splice(index, 1)
    },
    nextStep() {
      this.$refs.baseForm.validate(async valid => {
        if (!valid) return
        if (!this.areaList.length) return this.$message.error('请配置监区')
        // const res = await this.$api.addPrison(this.baseForm)
        if (!this.prisonId) return this.$message.error('请先新增或者选择监狱')
        await this.$api.setAreaList({
          prisonId: this.prisonId,
          areaList: this.areaList
        })
        this.activePage = 2
        this.getWeekdayAreaInfo()
      })
    },
    async getWeekdayAreaInfo() {
      try {
        this.callLoading = true
        const res = await this.$api.getWeekdayAreaInfo({
          prisonId: this.prisonId
        })
        this.weekdayAreaInfo = res
      } finally {
        this.callLoading = false
      }
    },
    openEditDialog(index) {
      this.weekDay = index
      this.$refs.updateWeek.dialogVisible = true
    },
    async lastStep() {
      // this.$refs.form.validate(async valid => {
      // if (!valid) return
      // this.weekdayAreaInfo.startTime = this.weekdayAreaInfo.startTime
      //   ? this.weekdayAreaInfo.startTime
      //   : ''
      // this.weekdayAreaInfo.endTime = this.weekdayAreaInfo.endTime
      //   ? this.weekdayAreaInfo.endTime
      //   : ''
      await this.$api.setWeekdayAreaInfo(this.weekdayAreaInfo)
      this.activePage = 3
      this.getMeetingRule()
      this.getMeetingTime()
      // })
    },
    async getMeetingRule() {
      const res = await this.$api.getMeetingRule({ prisonId: this.prisonId })
      this.callForm = res
    },
    async getMeetingTime() {
      const res = await this.$api.getMeetingTime({ prisonId: this.prisonId })
      this.composeList = res
    },
    addCompose() {
      this.$refs.composeForm.validate(async valid => {
        if (!valid) return
        if (
          this.composeList.some(
            item =>
              item.startTime === this.composeForm.startTime &&
              item.endTime === this.composeForm.endTime
          )
        )
          return this.$message.error('请勿重复添加相同时间段的排班')
        this.composeList.push(cloneDeep(this.composeForm))
      })
    },
    addMeetingRule() {
      this.$refs.callForm.validate(async valid => {
        if (!valid) return
        const res = await this.$api.addMeetingRule({
          prisonId: this.prisonId,
          ...this.callForm
        })
      })
    },
    async addMeetingTime() {
      console.log(this.composeList)
      if (!this.composeList.length) return this.$message.error('请配置排班设置')
      const res = await this.$api.addMeetingTime({
        prisonId: this.prisonId,
        list: this.composeList
      })
      this.$message.success('配置成功')
      this.activePage = 1
    },
    async submit() {
      await this.addMeetingRule()
      await this.addMeetingTime()
    },
    updateWeek(data) {
      this.weekdayAreaInfo[this.weekDay] = data
    }
  }
}
</script>

<style lang="scss">
.system-container {
  width: 100%;
  height: 100%;
  position: relative;
  .step-container {
    width: 100%;
    height: 100%;
    .btn-bottom {
      position: absolute;
      bottom: 110px;
      width: 100%;
      text-align: center;
      button {
        width: 100px;
      }
    }
  }
  .step-title {
    font-size: 15px;
    color: #4985e1;
    line-height: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    .circle {
      width: 4px;
      height: 4px;
      background: #4985e1;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
  .step-content {
    padding-left: 14px;
    margin-bottom: 20px;
    .el-form-item {
      margin-right: 30px;
      position: relative;
    }
    .max-label {
      line-height: 15px;
      font-size: 13px;
      display: flex;
      flex-direction: column;
      padding: 5px 0;
      justify-content: space-between;
      height: 40px;
      align-items: flex-start;
      & > span:nth-of-type(2) {
        font-size: 12px;
        color: #878787;
        line-height: 12px;
      }
    }
    .table-list {
      border: 1px solid rgba(238, 238, 238, 1);
      border-bottom: none;
      margin-top: 25px;
      margin-bottom: 24px;
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
    .el-form-item__label[for='maxMeetingTimes'] {
      &::before {
        position: absolute;
        left: -10px;
      }
    }
    button {
      width: 100px;
    }
  }
}

.area-list {
  padding-left: 64px;
  width: 1119px;
  margin-bottom: 150px;
}
.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
