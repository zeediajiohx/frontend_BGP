<template>
    <div class="h-full">
      <!-- 选择列的范围 -->
      <div>
        <label for="columnRange">select Columns:</label>
        <select v-model="selectedColumnRange" @change="updateChart">
          <option value="2-8">2-8列</option>
          <option value="9-17">9-17列</option>
          <option value="18-27">18-27列</option>
          <option value="28-40">28-40列</option>
          <option value="41-56">41-56列</option>
        </select>
      </div>
  
      <!-- 选择显示的行数 -->
      <div>
        <label for="rowRange">duration:</label>
        <select v-model="selectedRowCount" @change="updateChart">
          <option value="6">60 行（1小时）</option>
          <option value="1440">1440 行（1天）</option>
          <option value="10080">10080 行（7天）</option>
        </select>
      </div>
  
      <!-- 时间轴 -->
      
      <!-- 平行坐标系 -->
      <div ref="parallelChart" style="width: 100%; height: 300px; position: relative;"></div>
      <div  ref="timeline" id="timeline" style="width: 100%; height: 50px;"></div>
  
    </div>
  </template>
  
  <script>

  import * as echarts from 'echarts';
  import axios from 'axios';
  import * as d3 from 'd3';
// import { head } from 'node_modules/axios/index.cjs';
  // 定义颜色渐变函数，接收轴的索引i，返回不同的颜色
function getBoxColor(i, total) {
  // 定义颜色从浅蓝色 (#ADD8E6) 到深蓝色 (#00008B) 的渐变
  const startColor = d3.rgb(173, 216, 230); // 浅蓝色
  const endColor = d3.rgb(0, 0, 139); // 深蓝色

  // 使用d3的scaleLinear创建一个颜色插值函数
  const colorScale = d3.scaleLinear()
    .domain([0, total - 1]) // 输入范围，0到列的总数减1
    .range([startColor, endColor]); // 输出颜色范围

  // 返回当前轴的颜色
  return colorScale(i);
}

  export default {
    data() {
      return {
        selectedColumnRange: '2-8',  // 当前选择的列范围
        selectedRowCount: 6,  // 当前选择的行数
        timelineChart: null,  // 时间轴图表实例
        parallelChart: null,  // 平行坐标系图表实例
        csvData: [],  // 存储解析后的CSV数据
        timePoints: [],  // 存储所有时间点
        displayedData: [],  // 当前时间片显示的数据
        columnNames :[],
        columnOptions: {
          '2-8': [2, 3,4,5,6,7,8],
          '9-17': [9, 10, 11, 12, 13, 14, 15, 16, 17],
          '18-27': [18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
          '28-40': [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
          '41-56': [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55]
        }
      };
    },
    mounted() {
      this.initTimeline();
      
      
      this.initParallelChart();
      this.loadData();
      // this.CoordinatesChart();
    },
    methods: {
      async loadData() {
        const fileNames = ["t00_20050101__BGP50_1-1__rrc00.csv","t00_20000818__BGP04__rrc00.csv", "t01_20000818__BGP04-1__rrc00.csv"];
        const uniquetime = new Set();
        for (const fileName of fileNames) {
          const response = await axios.get(`/${fileName}`);
          const lines = response.data.split("\n");
          const headers = lines[0].split(",");
          if (this.columnNames.length ===0){
            this.columnNames = headers;
          }
          // 解析CSV数据
          lines.forEach((line, index) => {
            if (!line.trim()){
              return;
            }
            const values = line.split(",");
            if (values.every(value => isNaN(value.trim())) && values.length === headers.length) {
              return;
            }
            const timestamp = values[1];
            if (uniquetime.has(timestamp)){
              return;
            }
            uniquetime.add(timestamp);
            this.csvData.push(values);
              this.timePoints.push(timestamp);  // 假设第二列为timestamp
            
            // if (index > 0) {
            //   // this.csvData.push(values);
            //   // this.timePoints.push(values[1]);  // 假设第二列为timestamp
            // }
            // if (index === 0) return;  // 跳过标题行
            // const values = line.split(",");
            // this.csvData.push(values);
            // this.timePoints.push(values[1]);  // 假设第二列为timestamp
          });
          console.log(this.csvData.length,this.timePoints.length,"csv\\timepoint")
        }

        // 如果数据加载成功，重新初始化时间轴和图表
        this.initTimeline();  // 确保数据加载后重新初始化时间轴
        this.updateChart();
      },
      // 时间轴初始化函数
      // 更新时间轴的初始化函数
      initTimeline() {
        // 获取时间范围的最小和最大值
        const minTimestamp = Math.min(...this.timePoints);
        const maxTimestamp = Math.max(...this.timePoints);

        // 生成 20 个等间隔的时间点作为时间轴的标签
        const numLabels = 20;
        const interval = (maxTimestamp - minTimestamp) / (numLabels - 1);
        const labels = [];

        for (let i = 0; i < numLabels; i++) {
          const timestamp = minTimestamp + i * interval;
          labels.push(echarts.time.format(new Date(timestamp), 'yyyy/MM/dd'));  // 使用新的时间格式化函数
        }

        // 初始化 ECharts 时间轴
        const timelineChart = echarts.init(document.getElementById('timeline'));

        const timelineOption = {
          tooltip: {
            formatter: (params) => {
              return `时间: ${params.name}`;
            },
          },
          xAxis: {
            type: 'category',
            data: labels,
            boundaryGap: false,
            axisLabel: {
              formatter: function(value) {
                return echarts.time.format(new Date(value), 'yyyy/MM/dd');  // 格式化标签
              }
            }
          },
          yAxis: {    // 确保定义了yAxis
            show: false,
        },
          series: [{
            type: 'line',
            data: this.timePoints.map((time, idx) => [time, idx]),  // 初始数据为空，后续根据拖动填充数据
          }],
          dataZoom: [
            {
              type: 'slider',
              start: 0,
              end: 10,
              filterMode: 'none',
              handleIcon:
                'M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z',
              handleSize: '100%',
            },
          ],
        };

        timelineChart.setOption(timelineOption);
        console.log("labels:",labels[0],labels[1]);
        console.log("timepoint:",this.timePoints[0]);
        // this.timelineChart.on('datazoom',this.handleTimelineChange);

      }
      ,

      // 获取时间轴的等分点函数
      // getTimeAxisLabels() {
      //   if (this.timePoints.length === 0) {
      //     console.warn("没有时间数据可供显示");
      //     return [];
      //   }else{
      //     console.log("timepoints:",this.timePoints.length,this.timePoints[0],this.timePoints[this.timePoints.length-1])
      //   }

      //   const minTime = new Date(Math.min(...this.timePoints.map(t => new Date(t).getTime())));
      //   const maxTime = new Date(Math.max(...this.timePoints.map(t => new Date(t).getTime())));
      //   const timeDiff = (maxTime - minTime) / 19;  // 取20个点

      //   const labels = [];
      //   for (let i = 0; i <= 19; i++) {
      //     labels.push(new Date(minTime.getTime() + i * timeDiff));
      //   }
      //   return labels;
      // },
      

      // 加载数据并更新时间轴和图表
      

  
      // 初始化平行坐标系
      initParallelChart() {
        this.parallelChart = echarts.init(this.$refs.parallelChart);
  
        this.parallelChart.setOption({
          parallelAxis: [],  // 需要动态设置
          series: [
            {
              type: 'parallel',
              lineStyle: {
                width: 1,
                opacity: 0.5,
              },
              data: [],
            },
          ],
        });
      },
  
      // 处理时间轴的点击选择
      handleTimelineChange(params) {
        const startIndex = this.timePoints.indexOf(params.name);  // 找到点击时间点对应的索引
        const endIndex = startIndex + parseInt(this.selectedRowCount, 10);  // 根据选择的行数计算结束索引
        this.displayedData = this.csvData.slice(startIndex, endIndex);
        this.updateParallelChart();
      },
      getColorScale(dataLength) {
        return d3.scaleLinear()
          .domain([0, dataLength - 1])
          .range([d3.interpolateCool(0), d3.interpolateCool(1)]);
      },
      // 更新平行坐标系
      updateParallelChart() {
        if (!this.displayedData.length) return;
  
        // 获取所选列的索引范围
        const selectedColumns = this.columnOptions[this.selectedColumnRange];
        const colorScale = this.getColorScale(this.displayedData.length);  // 根据数据长度生成颜色渐变

        const colorGradient = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: 'lightblue' },
          { offset: 1, color: 'blue' },
        ]);
  
        // 设置平行坐标系
        this.parallelChart.setOption({
          parallelAxis: selectedColumns.map((col, idx) => ({
            dim: idx,
            name:`${this.columnNames[col]}`,
            // name: `Column ${col}`,  // 可替换为真实的列名称

            type: 'value',
          })),
          series: [
            {
              type: 'parallel',
              lineStyle: {
                width: 1,
                opacity: 0.5,
                color: colorGradient,
              },
              // data: this.displayedData.map((row) => selectedColumns.map((col) => row[col])),
              // const colorScale = getColorScale(data.length);  // 根据数据长度生成颜色渐变
              data: this.displayedData.map((row, index) => ({
                value: selectedColumns.map((col)=>row[col]),  // 每条数据
                lineStyle: {
                  color: colorScale(index)  // 设置颜色渐变
                }
              }))
            },
          ],
        });
        // setTimeout(() => {
        //   this.drawBoxPlot(this.displayedData, selectedColumns);
        // }, 1500);

        // this.drawBoxPlot(this.displayedData,selectedColumns)
      },
  
      // 获取时间轴的等分点
      // getTimeAxisLabels() {
      //   const minTime = new Date(Math.min(...this.timePoints.map(t => new Date(t).getTime())));
      //   const maxTime = new Date(Math.max(...this.timePoints.map(t => new Date(t).getTime())));
      //   const timeDiff = (maxTime - minTime) / 19;  // 取20个点
  
      //   const labels = [];
      //   for (let i = 0; i <= 19; i++) {
      //     labels.push(new Date(minTime.getTime() + i * timeDiff));
      //   }
      //   return labels;
      // },
  
      // 更新图表（列和行变化时）
      updateChart() {
        if (!this.csvData.length) return;
        
        this.handleTimelineChange({
          name: this.timePoints[0],  // 默认从第一个时间点开始
        });
        const selectedColumns = this.columnOptions[this.selectedColumnRange];
        this.drawBoxPlot(this.displayedData,selectedColumns)
      },


      // 箱线图
    //   calculateBoxPlotData(data, selectedColumns) {
    //       let boxPlotData = selectedColumns.map(col => {
    //           let colData = data.map(row => row[col]).filter(d => d !== undefined && d !== null);
    //           colData.sort((a, b) => a - b);

    //           let min = colData[0];
    //           let q1 = d3.quantile(colData, 0.25);
    //           let median = d3.median(colData);
    //           let q3 = d3.quantile(colData, 0.75);
    //           let max = colData[colData.length - 1];

    //           return {
    //               min: min,
    //               q1: q1,
    //               median: median,
    //               q3: q3,
    //               max: max
    //           };
    //       });

    //       return boxPlotData;
    //   }

    // },
    drawBoxPlot(data, selectedColumns) {
  const svg = d3.select(this.$refs.parallelChart)
    .append('svg')
    .attr('width', this.parallelChart.getWidth())
    .attr('height', this.parallelChart.getHeight())
    .style('position', 'absolute')
    .style('top', 0)
    .style('left', 0)
    .style('pointer-events', 'none'); // 禁止鼠标事件

  // 获取列在平行坐标系上的x位置
  selectedColumns.forEach((col, i) => {
    const colData = data.map(row => +row[col]).filter(d => !isNaN(d)).sort((a, b) => a - b);
    console.log("col:",col,"name:",this.columnNames[col],"i:",i)
    if (colData.length === 0) {
      console.warn(`列 ${col} 没有有效的数据`);
      return;
    }

    const min = d3.min(colData);
    const max = d3.max(colData);
    const q1 = d3.quantile(colData, 0.25);
    const median = d3.median(colData);
    const q3 = d3.quantile(colData, 0.75);

    // 使用 ECharts 的 convertToPixel 转换位置
    const x = this.parallelChart.convertToPixel({ seriesIndex: 0, dimension: i }, col-selectedColumns[0]); // 改为正确的 finder
    const yScale = d3.scaleLinear()
      .domain([min, max])
      .range([this.parallelChart.getHeight(), 0]);
      const color = getBoxColor(i, selectedColumns.length)
    // 绘制箱体
    svg.append('rect')
      .attr('x', x - 10)
      .attr('y', yScale(q3))
      .attr('width', 20)
      .attr('height', yScale(q1) - yScale(q3))  // 计算高度
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2);

    // 中位线
    svg.append('line')
      .attr('x1', x - 10)
      .attr('x2', x + 10)
      .attr('y1', yScale(median))
      .attr('y2', yScale(median))
      .attr('stroke', color)
      .attr('stroke-width', 2);

    // 须线
    svg.append('line')
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', yScale(max))
      .attr('y2', yScale(min))
      .attr('stroke', color)
      .attr('stroke-width', 2);
  });
}

    //  updateBoxPlot(data, selectedColumns) {
    //         let boxPlotData = calculateBoxPlotData(data, selectedColumns);
    //         drawBoxPlot(boxPlotData, parallelCoordinatesChart);
    //     },

        // 每次更新数据时重新渲染
    //  CoordinatesChart(){
    //   const selectedColumns = this.columnOptions[this.selectedColumnRange];
    //       parallelCoordinatesChart.on('dataZoom', function () {
    //         updateBoxPlot(this.displayedData, selectedColumns);
    //     });
    //     }

  }
}
  </script>
  
  <style scoped>
  #parallelChart {
    width: 100%;
    height: 300px;
  position: relative;

  }
  #timeline {
    width: 100%;
    height: 50px;
  }
  </style>
  