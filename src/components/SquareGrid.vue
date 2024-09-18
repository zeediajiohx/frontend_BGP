<template>
    <div ref="svgContainer"></div>
    <button @click="randomChangeBorder">Change Border</button>
  </template>
  
  <script>
  import * as d3 from 'd3';
  
  export default {
    name: 'SquareGrid',
    data() {
      return {
        numSquares: 45, // 总共45个正方形
        squareSize: 25, // 正方形边长
        squareGap: 18,   // 行间距
      };
    },
    mounted() {
      this.drawGrid();  // 组件加载时绘制正方形
    },
    methods: {
      // 画正方形网格
      drawGrid() {
        const svgWidth = this.squareSize * 15;  // 宽度：一行15个正方形
        const svgHeight = this.squareSize * 3 + this.squareGap * 2; // 高度：三行
  
        // 创建一个 SVG 画布
        const svg = d3.select(this.$refs.svgContainer)
          .append('svg')
          .attr('width', svgWidth)
          .attr('height', svgHeight);
  
        // 在SVG中画出45个正方形
        svg.selectAll('rect')
          .data(d3.range(this.numSquares))
          .enter()
          .append('rect')
          .attr('x', (d) => (d % 15) * this.squareSize)   // 计算每个正方形的x位置
          .attr('y', (d) => Math.floor(d / 15) * (this.squareSize + this.squareGap))  // 计算每个正方形的y位置
          .attr('width', this.squareSize)
          .attr('height', this.squareSize)
          .attr('stroke', 'black')   // 设置边框颜色为黑色
          .attr('stroke-width', 1)   // 边框宽度为1
          .attr('fill', 'none')      // 设置填充颜色为空
          .attr('id', (d) => `square-${d + 1}`);  // 给每个正方形设置一个唯一的ID
      },
      // 随机更改正方形左边的颜色
      randomChangeBorder() {
        const numChanges = Math.floor(Math.random() * 10) + 1;  // 随机更改1到10个正方形
        const squaresToChange = d3.shuffle(d3.range(this.numSquares)).slice(0, numChanges);
  
        squaresToChange.forEach((squareIndex) => {
          const square = d3.select(`#square-${squareIndex + 1}`);
          square.attr('stroke', 'black')  // 重置边框颜色
            .attr('stroke-width', 1);    // 重置边框宽度
  
          // 随机改变左边边框的颜色和宽度
          const x = (squareIndex % 15) * this.squareSize;
          const y = Math.floor(squareIndex / 15) * (this.squareSize + this.squareGap);
  
          d3.select(this.$refs.svgContainer).select('svg').append('line')
            .attr('x1', x)      // 左边的线
            .attr('y1', y)
            .attr('x2', x)
            .attr('y2', y + this.squareSize)
            .attr('stroke', 'red')
            .attr('stroke-width', 2);
        });
      },
    },
  };
  </script>
  
  <style scoped>
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  button {
    margin-top: 20px;
  }
  </style>
  