<template>
    <div class="h-full">
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
  
      <div>
        <label for="rowRange">duration:</label>
        <select v-model="selectedRowCount" @change="updateChart">
          <option value="6">60 行（1小时）</option>
          <option value="1440">1440 行（1天）</option>
          <option value="10080">10080 行（7天）</option>
        </select>
      </div>
  
      
      
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
  // 颜色渐变
function getBoxColor(i, total) {
  
  const startColor = d3.rgb(173, 216, 230); // 
  const endColor = d3.rgb(0, 0, 139); // 

  
  const colorScale = d3.scaleLinear()
    .domain([0, total - 1]) // 
    .range([startColor, endColor]); // 

  return colorScale(i);
}

  export default {
    data() {
      return {
        selectedColumnRange: '2-8',  // 列
        selectedRowCount: 6,  // hangshu
        timelineChart: null,  
        parallelChart: null,  // 
        csvData: [],  // 
        timePoints: [],  // 
        displayedData: [],  // 
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
              this.timePoints.push(timestamp);  // 
            
            // if (index > 0) {
            //   // this.csvData.push(values);
            //   // this.timePoints.push(values[1]);  
            // }
            // if (index === 0) return;  
            // const values = line.split(",");
            // this.csvData.push(values);
            // this.timePoints.push(values[1]);  
          });
          //console.log(this.csvData.length,this.timePoints.length,"csv\\timepoint")
        }

        // 
        this.initTimeline();  // 
        this.updateChart();
      },
      
      initTimeline() {
        // 时间范围
        const minTimestamp = Math.min(...this.timePoints);
        const maxTimestamp = Math.max(...this.timePoints);

        //  20 间隔时间点
        const numLabels = 20;
        const interval = (maxTimestamp - minTimestamp) / (numLabels - 1);
        const labels = [];

        for (let i = 0; i < numLabels; i++) {
          const timestamp = minTimestamp + i * interval;
          labels.push(echarts.time.format(new Date(timestamp), 'yyyy/MM/dd'));  
        }

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
                return echarts.time.format(new Date(value), 'yyyy/MM/dd');  
              }
            }
          },
          yAxis: {    
            show: false,
        },
          series: [{
            type: 'line',
            data: this.timePoints.map((time, idx) => [time, idx]),  
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

      // getTimeAxisLabels() {
      //   if (this.timePoints.length === 0) {
      //     console.warn("没数据");
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
      

      initParallelChart() {
        this.parallelChart = echarts.init(this.$refs.parallelChart);
  
        this.parallelChart.setOption({
          parallelAxis: [],  
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
  
      // timeline click
      handleTimelineChange(params) {
        const startIndex = this.timePoints.indexOf(params.name);  
        const endIndex = startIndex + parseInt(this.selectedRowCount, 10);  
        this.displayedData = this.csvData.slice(startIndex, endIndex);
        this.updateParallelChart();
      },
      getColorScale(dataLength) {
        return d3.scaleLinear()
          .domain([0, dataLength - 1])
          .range([d3.interpolateCool(0), d3.interpolateCool(1)]);
      },
      updateParallelChart() {
        if (!this.displayedData.length) return;
  
        
        const selectedColumns = this.columnOptions[this.selectedColumnRange];
        const colorScale = this.getColorScale(this.displayedData.length);  // 颜色

        const colorGradient = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: 'lightblue' },
          { offset: 1, color: 'blue' },
        ]);
  
        
        this.parallelChart.setOption({
          parallelAxis: selectedColumns.map((col, idx) => ({
            dim: idx,
            name:`${this.columnNames[col]}`,
            // name: `Column ${col}`,  

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
              // const colorScale = getColorScale(data.length);  
              data: this.displayedData.map((row, index) => ({
                value: selectedColumns.map((col)=>row[col]),  
                lineStyle: {
                  color: colorScale(index)  
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
  
      // getTimeAxisLabels() {
      //   const minTime = new Date(Math.min(...this.timePoints.map(t => new Date(t).getTime())));
      //   const maxTime = new Date(Math.max(...this.timePoints.map(t => new Date(t).getTime())));
      //   const timeDiff = (maxTime - minTime) / 19; 
  
      //   const labels = [];
      //   for (let i = 0; i <= 19; i++) {
      //     labels.push(new Date(minTime.getTime() + i * timeDiff));
      //   }
      //   return labels;
      // },
  
      updateChart() {
        if (!this.csvData.length) return;
        
        this.handleTimelineChange({
          name: this.timePoints[0],  // 默认从第一个时间点开始
        });
        const selectedColumns = this.columnOptions[this.selectedColumnRange];
        this.drawBoxPlot(this.displayedData,selectedColumns)
      },


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
    .style('pointer-events', 'none'); // 禁止鼠标

  
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

    
    const x = this.parallelChart.convertToPixel({ seriesIndex: 0, dimension: i }, col-selectedColumns[0]); // 改为正确的 finder
    const yScale = d3.scaleLinear()
      .domain([min, max])
      .range([this.parallelChart.getHeight(), 0]);
      const color = getBoxColor(i, selectedColumns.length)
   
    svg.append('rect')
      .attr('x', x - 10)
      .attr('y', yScale(q3))
      .attr('width', 20)
      .attr('height', yScale(q1) - yScale(q3))  
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
  