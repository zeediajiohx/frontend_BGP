<template>
    <div class="calendar-container">
      <div ref="calendarChart" class="calendar-chart"></div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  import axios from 'axios';
  import * as d3 from 'd3'; // 使用 d3 进行数据汇总
  
  export default {
    name: 'CalendarChart',
    data() {
      return {
        chartData: [],
        columnNames:[],
        timepoints:[],
        columnOption:{
          '2-8':[2,3,4,5,6,7,8]

        }
      };
    },
    mounted() {
      this.loadData();
      window.addEventListener('resize', this.resizeChart);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeChart);
    },
    methods: {
      async loadData() {
        const fileNames = ["t00_20050101__BGP50_1-1__rrc00.csv","t00_20000818__BGP04__rrc00.csv", "t01_20000818__BGP04-1__rrc00.csv"];
        const uniquetime = new Set();
        for (const filename of fileNames){
          const response = await axios.get(`/${filename}`)
          const lines = response.data.split("\n");
          const headers = lines[0].split(".")
          if (this.columnNames.length ===0){
            this.columnNames = headers;
          }
          lines.forEach((line,index) => {
            if(!line.trim()){
              return;
            }
            const values = line.split(",");
            if (values.every(value => isNaN(value.trim())) && values.length==headers.length){
              return;
            }
            const timestamp =values[1];
            if (uniquetime.has(timestamp)){
              return;
            }
            uniquetime.add(timestamp);
            this.chartData.push(values);
            this.timepoints.push(timestamp);
          });
                                               
        }
        const response = await axios.get('/t00_20000818__BGP04__rrc00.csv');
        const lines = response.data.split('\n').slice(1); 
        const data = lines.map((line) => line.split(','));
  
        
        const groupedData = d3.rollup(
          data,
          (v) => v.length,  
          (d) => d[1].split(' ')[0]  
        );
  
        // 转换为 ECharts 需要的数据格式
        this.chartData = Array.from(groupedData, ([date, value]) => [date, value]);
  
        this.drawCalendar();
      },
      drawCalendar() {
        const chartDom = this.$refs.calendarChart;
        const myChart = echarts.init(chartDom);
  
        const option = {
          title: {
            text: 'Calendar Heatmap',
            left: 'center',
          },
          tooltip: {
            position: 'top',
          },
          visualMap: {
            min: 0,
            max: d3.max(this.chartData, (d) => d[1]), // 根据数据动态设置最大值
            type: 'continuous',
            orient: 'horizontal',
            left: 'center',
            top: 30,
          },
          calendar: {
            orient: 'horizontal',
            left: 50,
            right: 50,
            cellSize: ['auto', 20], // 自动调整单元格宽度，高度为20px
            range: '2000', // 展示2000年的数据
            splitLine: {
              show: true,
              lineStyle: {
                color: '#ccc',
                type: 'dashed',
              },
            },
            yearLabel: { show: false },
            monthLabel: { color: '#999' },
            dayLabel: {
              firstDay: 1, // 设置周一为第一天
              nameMap: 'cn', // 中文显示周几
            },
          },
          series: {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            data: this.chartData,
          },
        };
  
        myChart.setOption(option);
      },
      resizeChart() {
        const chartDom = this.$refs.calendarChart;
        if (chartDom) echarts.getInstanceByDom(chartDom).resize();
      },
    },
  };
  </script>
  
  <style scoped>
  .calendar-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%; /* 确保填充父组件的剩余空间 */
  }
  
  .calendar-chart {
    flex: 1;
    width: 100%;
    height: 100%;
  }
  </style>
  