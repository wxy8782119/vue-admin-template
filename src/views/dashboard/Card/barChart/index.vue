<template>
  <div ref="charts" class="charts" />
</template>

<script>
// 引入echarts
import echarts from 'echarts'
export default {
  name: 'BarChart',
  mounted() {
    // 初始化echarts实例
    const barCharts = echarts.init(this.$refs.charts)
    // 配置数据
    barCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        // 均分
        type: 'category'
      },
      yAxis: {
        // 隐藏y轴
        show: false
      },
      // 系列
      series: [
        {
          // 图标形式-柱状图
          type: 'bar',
          data: [15, 10, 36, 10, 30, 25, 5, 10, 20, 5, 8, 16],
          color: 'cyan'
        }
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.charts {
    width: 100%;
    height: 100%;
}
</style>
