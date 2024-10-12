<template>
    <div class="sankey-container">
        <div ref="sankeyChart" class="sankey-chart"></div>
    </div>
</template>


<script>
    import * as echarts from 'echarts'
    import axios from 'axios'
    import * as d3 from 'd3'

    function getBoxColor(i,total){
        const startColor = d3.rgb(173,216,230);
        const endColor = d3.rgb(0,0,139);

        const colorScale = d3.scaleLinear().colorScale = d3.scaleLinear()
            .domain([0,total-1])
            .range([startColor,endColor]);
        return colorScale(i);
    }
     export default{
        name:'sankey',
        data(){
            return{
                JsonData:[],
            }
        },
        mounted(){
            this.lodaData();
        },
        methods:{
            async lodaData(){
                const response = await axios.get('/asnLinks2.jsonl',{responseType:'blob'});
                const text = await response.data.text();
                const lines = text.split('\n').filter(line =>line.trim());
                const data = lines.map(line => JSON.parse(line));
                
                const nodes = new Set();
                const selecteddata = data.sort((a,b) => b.numberPaths-a.numberPaths).slice(0,100);
                
                const links = selecteddata.map(item =>{
                    nodes.add(item.asn0.asn);
                    nodes.add(item.asn1.asn);
                    return{
                        source:item.asn0.asn,
                        target:item.asn1.asm,
                        value:item.numberPaths,
                        relationship:item.relationship,
                    };
                });
                const nodeArray = Array.from(nodes).map(node =>({name:node}));
                this.JsonData = {nodes:nodeArray,links};
                console.log("JSONDATA:",this.JsonData)
                this.drawSankey();
                
            },
            drawSankey(){
                const chartDom = this.$refs.sankeyChart;
                const mychart = echarts.init(chartDom);
                const option = {
                    title: {
                    text: 'AS Links Sankey Diagram',
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
            }
        }
     }
</script>
<style scoped>
.sankey-container {
  flex: 1;
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