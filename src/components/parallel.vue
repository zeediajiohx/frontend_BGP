<template>
    <div class ="flex flex-col ">
      <div  class = "flex">
        <label for="columns">select column:</label>
        <select v-model="selectedColumnRange" @change="updateParallelChartRange">
          <option value="2-8">VOL-data列</option>
          <option value="9-17">Path-data 列</option>
          <option value="18-27">18-27 列</option>
          <option value="28-40">AS-data 列</option>
          <option value="41-56">PP 列</option>
        </select>

      </div>
      <div>
        <label for="rowRange">time container:</label>
        <select v-model="selectedGranularity" @change="updateParallelChartTime">
          
          <option value="daily">day</option>
          <option value="hourly">hourly</option>
          <option value="weekly">7days</option>
        </select>
      </div>
      <div ref="parallelChart" style="width: 100%; height: 500px;"></div>
      <div ref = "timeline" style = "width:100%; height:50px;" ></div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  import axios from 'axios';
// import { time } from 'console';
// import { options } from 'node_modules/axios/index.cjs';
// import { serialize } from 'v8';
  
  export default {
    name: "ParallelCoordinate",
    data() {
      return {
        // selectedGranularity: 'hourly',
        selectedRowCount:60,
        timelineChart:null,
        parallerlChart:null,
        selectedColumnRange: '2-8',
        // chart: null,
        csvData: [],  // 存储解析后的 CSV 数据
        columnNames:[],
        timePoints:[],
        displayedData:[],
        columnRanges:[],
        headers:[],
        columnOptions: {
        '2-8': [2, 3, 4, 5, 6, 7, 8],
        '9-17': [9, 10, 11, 12, 13, 14, 15, 16, 17],
        '18-27': [18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
        '28-40': [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
        '41-56': [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56]
      }
      };
    },
    mounted() {
      this.initTimeLine();
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
        
        const promises = files.map(file => axios.get(`` `/${file}`));
        const responses = await Promise.all(promises);
        
        responses.forEach(response => {
          const lines = response.data.split("\n");
          lines.forEach((line, index) => {
            const values = line.split(",")
            if (index ===0){
                this.columnNames = values;
            }
            else{  // 跳过表头
            //   const values = line.split(",");
              this.csvData.push(values);
              this.timePoints.push(values);
            }
          });
        });
        // this.timePoints = this.csvData.map(row =>row[0]);
        // this.updateParallelChartRange();
        // this.updateParallelChartTime();
        this.updateChart();
      },

      initTimeLine(){
        this.timelineChart = echarts.init(this.$refs.timeline);
        this.timelineChart.setOption({
          tooltip: {
            formatter: (params) => {
              return `时间: ${params.name}`;
            },
          },
          xAxis: {
            type: 'time',
          },
          yAxis: {
            show: false,
          },
          series: [
            {
              type: 'line',
              data: this.timePoints.map((time, idx) => [time, idx]),  // 用时间作为X轴
            },
          ],
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
        });
        this.timelineChart.on('datazoom',this.handleTimelineChange);

      },
      
      initParallelChart() {
        this.parallerlChart = echarts.init(this.$refs.parallelChart);
        this.parallerlChart.setOption({
          parallelAxis:[],
          series:[
            {
              type:'paraller',
              lineStyle:{
                width:1,  
                opacity:0.5,
              },
              data:[],
            }
          ]
        })
      },
      handleTimelineChange(params) {
        const startIndex = Math.floor((params.start / 100) * this.timePoints.length);
        const endIndex = startIndex + parseInt(this.selectedRowCount, 10);
        this.displayedData = this.csvData.slice(startIndex, endIndex);
        this.updateParallelChart();
      },
      updateParallelChartRange(){
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
  
        this.parallerlChart.setOption({
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
      },
      updateParallelChart() {
        if (!this.displayedData.length) return;
        const selectedColumns = this.columnOptions[this.selectedColumnRange];

        // if (!this.csvData.length) return;
        const aggregatedData = this.aggregateData(this.selectedGranularity);
        const colorGradient = new echarts.graphic.LinearGradient(0,0,1,0,[
          {offset: 0, color: 'lightblue'},
          {offset:1, color: 'blue'}
        ]);
        
        const rangelen = selectedColumns.length;
        const range = this.selectedColumnRange.split('-').map(Number);
        // const selectedColumns = this.displayedData.map(row => row.slice(range[0], range[1] + 1));
  
        const parallelAxis = [];
        for (let i = 0; i <= rangelen; i++) {
            const columnData = selectedColumns.map(row => parseFloat(row[selectedColumns[i]]));
            const minVal = Math.min(...columnData);
            const maxVal = Math.max(...columnData);
            parallelAxis.push({
              dim: i - range[0],
              name: this.headers[i],
              min:minVal,
              max:maxVal,
              inverse: false,
              type: 'value',
            });
        }
        // const timelineData = this.timePoints.map(time,index =>({
        //     value:time,
        //     tooltip:{
        //         formatter:`Time: ${time}`
        //     }
        // }));
  
        this.parallerlChart.setOption({
          parallelAxis:selectedColumns.map((col,idx) =>({
            dim:idx,
            name:`Column${col}`,
            type:'value',
          })),
          series:[
            {
              type:'parallel',
              lineStyle:{
                width:1,
                opacity:0.5,
                color:colorGradient,
              },
              // data:this.displayedData.map((row) => row.slice(2,8))
              data:this.displayedData.map((row) => selectedColumns.map((col)=>row[col])),
            }
          ],
          // timeLine:{
          //           axisType:'category',
          //           autoPlay:false,
          //           playInterval:1000,
          //           data:timelineData,
          //           label:{
          //             formatter:(value)=> value,
          //             show:true,
          //           },
          //           tooltip:{
          //             show:true
          //           }
                    
          //       },
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
                    lineStyle:{
                      width:1,
                      opacity:0.5,
                      color:colorGradient,
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
                },
            // baseOption:{
                
            // },
            options:this.timePoints.map((time,index) => ({
              series:[{
                data:[selectedColumns[index]]
              }]
            }))
          
          
          
          
        });
      },
      updateChart() {
        if (!this.csvData.length) return;
        
        this.handleTimelineChange({
          start: 0,
          end: 10,
        });
      },
    }
  };
  </script>
  
  <style scoped>
  #parallelChart {
    width: 100%;
    height: 600px;
  }
  #timeline{
    width:100%;
    height: 50px;
  }
  </style>
  