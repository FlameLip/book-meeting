<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="name" width="180" align="center" />
      <el-table-column label="审核权限" width="130" align="center" prop="verifyLv">
        <template slot-scope="scope">
          <span>{{ verifyObj[scope.row.verifyLv] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="控制安全级别" width="130" align="center" prop="isSafety">
        <template slot-scope="scope">
          {{ scope.row.isSafety ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="管理区域" align="center" prop="manageAreaStr">
        <template slot-scope="scope">
          {{ scope.row.manageAreaStr }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

const verifyObj =
    {
      'verify-lv1': '初审',
      'verify-lv2': '终审',
      'step': 1 // 审核步数
    }
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      verifyObj
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.$api.getList().then(response => {
        this.list = response.items
        this.listLoading = false
      })
    }
  }
}
</script>
