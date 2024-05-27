<template>
  <div>
    <div class="header">
      <span class="search-header">搜索用户数</span>
      <i class="el-icon-warning-outline" />
    </div>
    <div class="main">
      <span class="main-title">132132</span>
      <span class="main-content">17.1</span>
      <i class="el-icon-caret-top" style="color:greenyellow" />
      <!-- <i class="el-icon-caret-bottom" style="color:red" /> -->
    </div>
    <div class="footer">
      <div ref="charts" class="charts" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  mounted() {
    // 初始化echarts实例
    const lineCharts = echarts.init(this.$refs.charts)
    // 配置数据
    lineCharts.setOption({
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
          smooth: true,
          type: 'line',
          data: [15, 10, 36, 10, 30, 25, 5, 10, 20, 5, 8, 16],
          // 拐点的样式的设置
          itemStyle: {
            opacity: 0
          },
          // 线条的样式
          lineStyle: {
            color: 'blue'
          },
          // 填充颜色设置
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'blue' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#fff' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      ],
      // 布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
      // tooltip: {}
    })
  }
}
</script>

<style scoped>
.header{
    display: flex;
    align-items: center;
    color: #5c5c5c;
}
.search-header{
    margin-right: 5px;
    font-size: 18px;
}
.main{
    margin: 10px 0;
}
.main-title{
    margin-right: 30px;
    font-size: 25px;
}
.main-content{
    margin-right: 5px;
}
.charts{
    width: 100%;
    height: 50px;
}
</style>
