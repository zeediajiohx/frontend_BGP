<template>
    <div class="sankey-container">
        <div ref="sankeyChart" class="sankey-chart"></div>
    </div>
</template>


<script>
    import * as echarts from 'echarts'
    import axios from 'axios'

     export default{
        name:'sankeychart',
        data(){
            return{
                JsonData:[],
            }
        },
        mounted(){
            this.lodaData();
            window.addEventListener('resize', this.resizeChart);
        },
        
        methods:{
            resizeChart() {
              const chartDom = this.$refs.sankeyChart;
              const mychart = echarts.getInstanceByDom(chartDom);
              if (mychart) {
                mychart.resize(); 
              }
            },
            async lodaData(){
                const response = await axios.get('/asnLinks2.jsonl',{responseType:'blob'});
                const text = await response.data.text();
                const lines = text.split('\n').filter(line =>line.trim());
                const data = lines.map(line => JSON.parse(line));
                
                const nodes = new Set();
                const selecteddata = data.sort((a,b) => b.numberPaths-a.numberPaths).slice(0,180);
                const labelsdata = selecteddata.slice(0,20);
                const links = selecteddata.map(item =>{
                    nodes.add(item.asn0.asn);
                    nodes.add(item.asn1.asn);
                    let color;
                    switch (item.relationship) {
                      case 'peer':
                        color = '#1f77b4'; 
                        break;
                      case 'customer':
                        color = '#ff7f0e'; 
                        break;
                      case 'provider':
                        color = '#2ca02c'; 
                        break;
                      default:
                        color = '#d62728'; }
                    return{
                        source:item.asn0.asn,
                        target:item.asn1.asn,
                        value:item.numberPaths,
                        relationship:item.relationship,
                        lineStyle: {
                          color: color,  
                        },
                        
                    };
                });
                const labeledNodes = new Set();
                labelsdata.forEach(item => {
                  labeledNodes.add(item.asn0.asn);
                  labeledNodes.add(item.asn1.asn);
                });
                const nodeArray = Array.from(nodes).map(node =>({
                  name:node,
                  label: { show: labeledNodes.has(node)},

                  }));
                this.JsonData = {nodes:nodeArray,links};
                console.log("JSONDATA:",this.JsonData.links)
                this.$nextTick(() => {
                  setTimeout(() => {
                    this.drawSankey();
                  }, 100); 
                });
                this.drawSankey();
                
            },
            drawSankey(){
                const chartDom = this.$refs.sankeyChart;
                const mychart = echarts.init(chartDom);
                const option = {
                    title: {
                    text: 'AS Links Sankey Diagram',
                    left: 'center',
                    },
                    tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove',
                    },
                    series: {
                    type: 'sankey',
                    data: this.JsonData.nodes,
                    links: this.JsonData.links,
                    emphasis: {
                        focus: 'adjacency',
                    },
                    lineStyle: {
                        color: 'source',
                        curveness: 0.5,
                    },
                    label: {
                        position: 'right',
                        formatter: '{b}',
                    },
                    },
                };
                mychart.setOption(option);
            },
            beforeDestroy() {
              window.removeEventListener('resize', this.resizeChart); 
            },
        }
     }
</script>
<style scoped>
.sankey-container {
  display: flex;
  flex-direction: column;
  height: 100%; 
}

.sankey-chart {
  flex: 1;
  width: 100%;
  height: 100%; 
}
</style>