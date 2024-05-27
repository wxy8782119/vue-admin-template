<template>
  <el-card class="box-card">
    <div slot="header" class="header">
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span class="">
            <i class="el-icon-more" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item disabled>双皮奶</el-dropdown-item>
            <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <line-charts />
        </el-col>
        <el-col :span="12">
          <line-charts />
        </el-col>
      </el-row>
      <el-table :data="tableData" size="mini" style="width: 100%" border>
        <el-table-column label="排名" type="index" width="80" />
        <el-table-column label="搜搜关键字" sortable width="150" />
        <el-table-column label="用户数" sortable />
        <el-table-column label="周涨幅" sortable />
      </el-table>
      <el-pagination style="float: right" layout="prev, pager, next" :total="1000" />
    </div>
  </el-card>
</template>

<script>
import LineCharts from './lineCharts'
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    LineCharts
  },
  data() {
    return {
      tableData: []
    }
  }
}
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* .header {
    border-bottom: 1px solid #eee;
} */
::v-deep .el-card__header {
    border-bottom: 1px solid #eee;
    padding: 18px 20px 8px 20px;
}
</style>
