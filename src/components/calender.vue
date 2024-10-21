<template>
    <div class="heatmap-container">
      <div class="controls">
        <label for="columnRange">Select Column:</label>
        <select v-model="selectedColumn" @change="updateChart">
          <option v-for="(column, index) in columnNames" :key="index" :value="index">
            {{ column }}
          </option>
        </select>
      </div>
      <div ref="heatmapChart" class="heatmap-chart"></div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  import axios from 'axios';
  import * as d3 from 'd3'; // 使用 d3 进行数据汇总
  
  export default {
    name: 'CalendarHeatmap',
    data() {
      return {
        chartData: [],
        columnNames:[],
        timepoints:[],
        mychart:null,
        selectedColumn:2,
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
          const headers = lines[0].split(",")
          
          if (this.columnNames.length ===0){
            this.columnNames = headers;
          }
          console.log("headers:",this.columnNames)
          lines.forEach((line, index) => {
            if (!line.trim()){
              return;
            }
            const values = line.split(",");
            if (values.every(value => parseFloat(value).toString()=="NaN") && values.length === headers.length) {
              console.log("String?:",values[1])
              return;
            }
            if (values[0] == "time_bin"){
              return ;
            }
            const timestamp = values[1];
            if (uniquetime.has(timestamp)){
              return;
            }
            uniquetime.add(timestamp);
            this.chartData.push(values);
            this.timepoints.push(timestamp); 
          });
        }
       // console.log(this.chartData[0])
        this.updateChart();
                                               
        },

        //const response = await axios.get('/t00_20000818__BGP04__rrc00.csv');
        //const lines = response.data.split('\n').slice(1); 
        //const data = lines.map((line) => line.split(','));
  //
        //
        //const groupedData = d3.rollup(
        //  data,
        //  (v) => v.length,  
        //  (d) => d[1].split(' ')[0]  
        //);
  //
        //[]
        //this.chartData = Array.from(groupedData, ([date, value]) => [date, value]);
//
        //this.drawCalendar();
      //
      updateChart() {
        const chartDom = this.$refs.heatmapChart;
        if (!this.myChart) {
          this.myChart = echarts.init(chartDom);
        }

        // 将数据转换为 ECharts 所需的格式
        const data = this.chartData.map(row => {
          return [row[1].split(' ')[0], parseFloat(row[this.selectedColumn])];
        });
        //console.log("years:",data)
        // 生成日历的年份范围
        const years = [...new Set(this.timepoints.map(time => time.split('-')[0]))];
         const validYears = years.filter(year => !isNaN(new Date(year).getFullYear()));
        // 配置选项
        const option = {
          title: {
            //text: 'Calendar Heatmap',
          },
          tooltip: {
            position: 'top',
            formatter: function (p) {
              const format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
              return `${format}: ${p.data[1]}`;
            },
          },
          visualMap: {
            min: 0,
            max: Math.max(...data.map(d => d[1])),
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%',
          },
          calendar: validYears.map((year, index) => ({
            top: `${10 + index * 20}%`,  // 调整日历表的 top 属性，使其居中显示
            left: 'center',
            range: year,
            cellSize: ['auto', 20],
            itemStyle: {
              borderWidth: 0.5,
            },
            yearLabel: { show: false },
            dayLabel: {
              firstDay: 1,
              nameMap: 'en',
            },
            monthLabel: {
              nameMap: 'en',
            },
          })),
          series: validYears.map((year, index) => ({
            type: 'heatmap',
            coordinateSystem: 'calendar',
            calendarIndex: index,
            data: data.filter(d => d[0].startsWith(year)),
          })),
        };

        this.myChart.setOption(option);
      },
      resizeChart() {
        const chartDom = this.$refs.heatmapChart;
        if (chartDom) echarts.getInstanceByDom(chartDom).resize();
      },
  },
  }
  
  </script>
  
  <style scoped>
  .heatmap-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .controls {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #fefdfd;
  }

  .heatmap-chart {
    flex: 1;
    width: calc(100% - 10px);
    height: 100%;
    padding: 0 5px;
  }
  </style>
  