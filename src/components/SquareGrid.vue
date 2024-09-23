<template>
    <div ref="svgContainer"></div>
    <button @click="randomChangeBorder" >Drift ?</button>
  </template>
  
  <script>
  import * as d3 from 'd3';
  
  export default {
    name: 'SquareGrid',
    data() {
      return {
      numSquares: 75, // 总共75个正方形 (5行，每行15个)
      squareSize: 35, // 正方形边长
      squareGap: 38,  // 行间距
      points: [],     // 存储所有方块的位置
      lines: [],      // 存储所有折线的路径
      rowOptions: ['VOL', 'peer', 'AS', 'origin', 'ED'] // 选择框可选项
    };
    },
    mounted() {
      this.drawGrid();  // 组件加载时绘制正方形
    },
    methods: {
      // 画正方形网格
      drawGrid() {
        const svgWidth = this.squareSize * 15;  // 宽度：一行15个正方形
        const svgHeight = this.squareSize * 5 + this.squareGap * 5; // 高度：五行

        // 创建一个 SVG 画布
        const svg = d3.select(this.$refs.svgContainer)
          .append('svg')
          .attr('width', svgWidth + 400)  // 加宽以放置选择框
          .attr('height', svgHeight);

        // 初始化方块位置
        this.points = d3.range(this.numSquares).map((d) => ({
          x: (d % 15) * this.squareSize + 200,  // 向右偏移以放置选择框
          y: Math.floor(d / 15) * (this.squareSize + this.squareGap),
          id: d + 1
        }));

        // 定义拖拽行为
        const drag = d3.drag()
          .on('start', function(event) {
            d3.select(this).raise().attr('stroke', 'black');
          })
          .on('drag', function(event) {
            d3.select(this)
              .attr('x', event.x - d3.select(this).attr('width') / 2)
              .attr('y', event.y - d3.select(this).attr('height') / 2);
          })
          .on('end', function(event) {
            d3.select(event.sourceEvent.target)
              .attr('stroke', 'green')
              .attr('stroke-width', 3);
          });

        // 在SVG中画出75个正方形，并绑定拖拽行为
        svg.selectAll('rect')
          .data(this.points)
          .enter()
          .append('rect')
          .attr('x', d => d.x)
          .attr('y', d => d.y)
          .attr('width', this.squareSize)
          .attr('height', this.squareSize)
          .attr('stroke', 'black')   // 设置边框颜色为黑色
          .attr('stroke-width', 1)   // 边框宽度为1
          .attr('fill', 'white')      // 设置填充颜色为空
          .attr('id', d => `square-${d.id}`)  // 给每个正方形设置一个唯一的ID
          .call(drag);  // 绑定拖拽行为

        // 为每一行添加选择框
        this.rowOptions.forEach((option, row) => {
          svg.append('foreignObject')
            .attr('x', 0)
            .attr('y', row * (this.squareSize + this.squareGap))
            .attr('width', 200)
            .attr('height', this.squareSize)
            .append('xhtml:div')
            .html(`
            <label>select：</label>
            <select>
               <option value="VOL">VOL</option>
               <option value="peer">peer</option>
               <option value="AS">AS</option>
               <option value="origin">origin</option>
               <option value="ED">ED</option>
             </select>`);
        });

        // 为每一行添加折线
        this.drawLine(svg);
      }
      ,
      drawLine(svg) {
        const lineGenerator = d3.line()
          .x(d => d.x)  // 根据x坐标生成点
          .y(d => d.y)  // 根据y坐标生成点
          .curve(d3.curveLinear);  // 使用线性折线

        const colorScheme = d3.schemeCategory10;  // 使用D3提供的颜色方案

        // 遍历每一行生成折线
        for (let row = 0; row < 5; row++) {
          const points = [];
          for (let i = 0; i <= 15; i++) {
            // 计算每个点的x和y位置，x为两个方格之间的位置，y为当前行的y值
            const x = i * this.squareSize + 200;  // 方格交界处x坐标，向右偏移100px
            const y = row * (this.squareSize + this.squareGap) + Math.random() * this.squareSize;  // 当前行y坐标，随机y值
            points.push({ x, y });
          }

          // 绘制折线
          svg.append('path')
            .datum(points)
            .attr('d', lineGenerator)  // 使用生成的折线数据
            .attr('fill', 'none')
            .attr('stroke', colorScheme[row % colorScheme.length])  // 设置折线颜色
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
          const x = (squareIndex % 15) * this.squareSize+200;
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
  