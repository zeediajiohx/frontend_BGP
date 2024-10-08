<template>
  <h1> The scatter of detection results!</h1>
  <div ref="chart" :style="{ width: containerWidth, height: containerHeight }" id="scacontin"></div>
</template>
  <script >
  
  import * as d3 from 'd3';

  // const chartRef = ref(null);

  export default {
    props: {
      containerWidth: {
        type: String,
        required: true,
      },
      containerHeight: {
        type: String,
        required: true,
      },
    },
      mounted(){
          d3.json("BI_2data_for_d3.json").then(data => {
            const xExtent = d3.extent(data['tsne_results'], d => d[0]);
            const yExtent = d3.extent(data['tsne_results'], d => d[1]);
            const pointSize = 5;

            const svgWidth = Math.max(this.scatterWidth, xExtent[1] * 10 + pointSize);
            const svgHeight = Math.max(this.scatterHeight, yExtent[1] * 10 + pointSize);

            const svg = d3.select(this.$refs.chart)
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);
        // 创建SVG元素
        // const svg = d3.select(this.$refs.chart)
        //   .append("svg")
        //   .attr("width", this.scatterWidth)
        //   .attr("height", this.scatterHeight);
  
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
        svg.selectAll("circle")
          .data(data['tsne_results'])
          .join("circle")
          .attr("cx", d => d[0] * 5 + 150)
          .attr("cy", d => d[1] * 5 + 150)
          .attr("r", 5)
          .attr("fill", (d, i) => colorScale(data['true_labels'][i]))
          .attr("stroke", (d, i) => colorScale(data['pred_labels'][i]))
          .attr("stroke-width", 3);
      });
  
      },
      
  }
  
  </script>