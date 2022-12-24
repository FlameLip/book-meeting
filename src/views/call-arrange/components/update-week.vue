<!--
 * @Descripttion:
 * @Version: 1.0
 * @Author: FlameLip 18070568168@163.com
 * @Date: 2022-12-23 23:59:29
-->
<template>
  <el-dialog
    title=""
    :visible.sync="dialogVisible"
    width="580px"
    center
    :show-close="false"
  >
    <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
      >全选</el-checkbox
    >
    <div style="margin-bottom: 25px"></div>
    <div class="area-check">
      <el-checkbox-group
        v-model="checkedArea"
        @change="handleCheckedAreaChange"
      >
        <el-checkbox v-for="item in manageAreaList" :label="item" :key="item">{{
          item
        }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="updateSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['weekDay', 'weekdayAreaInfo', 'areaList'],
  data() {
    return {
      dialogVisible: false,
      manageAreaList: [],
      checkAll: false,
      checkedArea: [],
      isIndeterminate: false
    }
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.manageAreaList = this.areaList.map(item => item.name)
        this.checkedArea = this.weekdayAreaInfo[this.weekDay] || []
        let checkedCount = this.checkedArea.length
        this.checkAll = checkedCount === this.manageAreaList.length
        this.isIndeterminate =
          checkedCount > 0 && checkedCount < this.manageAreaList.length
      } else {
        this.checkedArea = []
      }
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedArea = val ? this.manageAreaList : []
      this.isIndeterminate = false
    },
    handleCheckedAreaChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.manageAreaList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.manageAreaList.length
    },
    async updateSubmit() {
      // await this.$api.setWeekdayAreaInfo({
      //   prisonId: '',
      //   [this.weekDay]: this.checkedArea
      // })
      this.$message.success('修改成功')
      this.dialogVisible = false
      this.$emit('submit', this.checkedArea)
    }
  }
}
</script>

<style lang="scss">
.area-check {
  .el-checkbox-group {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .el-checkbox {
      width: 100px;
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
