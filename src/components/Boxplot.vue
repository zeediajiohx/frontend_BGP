<template>
  <div>
    <div>
      <label for="columns">选择要显示的列:</label>
      <select v-model="selectedRange" @change="updateParallelChart">
        <option value="2-8">2-8 列</option>
        <option value="9-17">9-17 列</option>
        <option value="18-27">18-27 列</option>
        <option value="28-40">28-40 列</option>
        <option value="41-56">41-56 列</option>
      </select>
    </div>
    <div ref="parallelChart" style="width: 100%; height: 500px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: "ParallelCoordinate",
  data() {
    return {
      selectedRange: '2-8',
      chart: null,
      csvData: [],  // 存储解析后的 CSV 数据
    };
  },
  mounted() {
    this.initParallelChart();
    this.loadData();
  },
  methods: {
    async loadData() {
      // 加载所有 CSV 文件
      const files = [
        "t00_20000818__BGP04__rrc00.csv",
        "t01_20000818__BGP04-1__rrc00.csv"
      ];
      
      const promises = files.map(file => axios.get(`/public/${file}`));
      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        const lines = response.data.split("\n");
        lines.forEach((line, index) => {
          if (index > 0) {  // 跳过表头
            const values = line.split(",");
            this.csvData.push(values);
          }
        });
      });
      
      this.updateParallelChart();
    },
    
    initParallelChart() {
      this.chart = echarts.init(this.$refs.parallelChart);
    },

    updateParallelChart() {
      if (!this.csvData.length) return;

      const range = this.selectedRange.split('-').map(Number);
      const selectedColumns = this.csvData.map(row => row.slice(range[0], range[1] + 1));

      const parallelAxis = [];
      for (let i = range[0]; i <= range[1]; i++) {
        parallelAxis.push({
          dim: i - range[0],
          name: `Column ${i}`,
          inverse: false,
          type: 'value',
        });
      }

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        parallel: {
          left: '5%',
          right: '13%',
          bottom: '10%',
          parallelAxisDefault: {
            type: 'value',
            nameLocation: 'end',
            nameGap: 20,
            splitNumber: 3,
            nameTextStyle: {
              color: '#333',
              fontSize: 12
            },
            axisLine: {
              lineStyle: {
                color: '#aaa'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#777'
              }
            },
            splitLine: {
              show: false
            }
          }
        },
        parallelAxis: parallelAxis,
        series: [
          {
            name: 'Data',
            type: 'parallel',
            lineStyle: {
              width: 2
            },
            data: selectedColumns
          }
        ],
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        }
      });
    }
  }
};
</script>

<style scoped>
#parallelChart {
  width: 100%;
  height: 500px;
}
</style>
