<template>
    <div ref="chart" :style="{ width: '100%', height: '100%' }" id="scacontin"></div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch, nextTick } from 'vue';
  import * as d3 from 'd3';
  
  interface Props {
    containerWidth: number;
    containerHeight: number;
  }
  
  const props = defineProps<Props>();
  
  const chart = ref<HTMLElement | null>(null);
  
  const drawChart = (width: number, height: number) => {
    // 清空旧的 SVG 内容
    d3.select(chart.value).selectAll('*').remove();
    const viewBox = ref('');
    viewBox.value = `0 0 ${props.containerWidth} ${props.containerHeight}`;

    const svg = d3.select(chart.value)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox',viewBox);
  
    d3.json('BI_data_for_d3.json').then(data => {
      const xExtent = d3.extent(data['tsne_results'], (d: [number, number]) => d[0]);
      const yExtent = d3.extent(data['tsne_results'], (d: [number, number]) => d[1]);
      const pointSize = 4;
      const xScale = d3.scaleLinear().domain(xExtent as [number, number]).range([0, width]);
      const yScale = d3.scaleLinear().domain(yExtent as [number, number]).range([height, 0]);
  
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      svg.selectAll('circle')
        .data(data['tsne_results'])
        .enter()
        .append('circle')
        .attr('cx', (d: [number, number]) => xScale(d[0]))
        .attr('cy', (d: [number, number]) => yScale(d[1]))
        .attr('r', pointSize)
        .attr("fill",  (d, i) => colorScale(data['true_labels'][i]))
        .attr("stroke", (d, i) => colorScale(data['pred_labels'][i]))
        .attr('stroke-width', 1);
    });
  };
  
  
  const updateChartSize = () => {
    nextTick(() => {
      if (chart.value) {
        const width = chart.value.clientWidth;
        const height = chart.value.clientHeight;
        drawChart(width, height);
      }
    });
  };
  
  onMounted(() => {
    updateChartSize();
    window.addEventListener('resize', updateChartSize);
  });
  
  watch([() => props.containerWidth, () => props.containerHeight], () => {
    updateChartSize();
  });
  </script>
  
  <style scoped>
  #scacontin {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  