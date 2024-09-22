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
        squareSize: 35, // 正方形边长
        squareGap: 38,   // 行间距
        points:[],
        lines:[]
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
        const drag = d3.drag()
        .on('start',function(event){
          d3.select(this).raise().attr('stroke','black');
        })
        .on('drag',function(event){
          d3.select(this)
          .attr('x',event.x - d3.select(this).attr('width')/2)
          .attr('y',event.y -d3.select(this).attr('height')/2);
        })
        .on('end',function(event){
          d3.select(event.sourceEvent.target)
          .attr('stroke','green')
          .attr('stroke-width',3);
        });

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
          .attr('fill','white')      // 设置填充颜色为空
          .attr('id', (d) => `square-${d + 1}`)
          .call(drag);  // 给每个正方形设置一个唯一的ID

        // 为每一行添加折线
        this.drawLine(svg);
      }
      ,
      drawLine(svg) {
        const lineGenerator = d3.line()
          .x(d => d.x)  // 根据x坐标生成点
          .y(d => d.y)  // 根据y坐标生成点
          .curve(d3.curveLinear);  // 使用线性折线

        // 遍历每一行生成折线
        for (let row = 0; row < 3; row++) {
          // 生成当前行的 14 个转折点，每个点位于两个方格的交界处
          const points = [];
          for (let i = 0; i <= 15; i++) {
            // 计算每个点的x和y位置，x为两个方格之间的位置，y为当前行的y值
            const x = (i ) * this.squareSize;  // 方格交界处x坐标
            const y = row * (this.squareSize + this.squareGap) + Math.random()*this.squareSize ;  // 当前行y坐标
            points.push({ x, y });
          }

          // 绘制折线
          svg.append('path')
            .datum(points)
            .attr('d', lineGenerator)  // 使用生成的折线数据
            .attr('fill', 'none')
            .attr('stroke', 'blue')  // 设置折线颜色
            .attr('stroke-width', 2);  // 设置折线宽度
        }
      }
      ,
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
  