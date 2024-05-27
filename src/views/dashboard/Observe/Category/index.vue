<template>
  <el-card class="box-card">
    <div slot="header" class="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="radio1" size="mini">
          <el-radio-button label="全部渠道" />
          <el-radio-button label="线上" />
          <el-radio-button label="门店" />
        </el-radio-group>
      </div>
    </div>
    <div>
      <div ref="charts" class="charts" />
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      radio1: '全部渠道'
    }
  },
  mounted() {
    const myCharts = echarts.init(this.$refs.charts)
    myCharts.setOption({
      title: {
        text: '门店销售数据',
        subtext: 1048,
        left: 'center',
        top: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside'
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广告' },
            { value: 300, name: '视频广告' }
          ]
        }
      ]
    })
    // 绑定事件
    myCharts.on('mouseover', (params) => {
      const { name, value } = params.data
      myCharts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  }
}
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
::v-deep .el-card__header {
    border-bottom: 1px solid #eee;
    padding: 18px 20px 8px 20px;
}
.charts{
  width: 100%;
  height: 300px;
}
</style>
