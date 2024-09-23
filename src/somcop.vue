<template>
  <html lang="en" class="text-gray-900 bg-gray-100 font-serif">
  <!-- ... -->
  </html>

  <div class="flex  flex-col    h-screen  p-1">
     <!-- top -->
    <div class="h-3/5  flex border border-gray-500 p-1   ">
      <!-- top left -表单  -->
        <div class="w-1/4 flex flex-col border-t border-l border-b border-dashed border-gray-500 h-full  ">
            
            <div class="   top-title">left</div>
            
            <div class="content-fill  w-full  h-full flex-grow">
                <el-space direction="vertical" 
                    alignment="start" 
                    :size=" 30" 
                    class="w-full center h-full  flex py-0 first:pt-2 last:pb-2   active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 item-center"   >
                </el-space>
            </div>
              
        </div>
      <!-- top center -主图  -->

      <div class = "w-1/2   border-dashed border border-gray-500    relative   ">
        <div class="bg-slate-600   top-title">center</div>
        <SquareGrid/>
      </div>
      <!-- top right -散点 -->
      <div class="w-1/4 border-t border-r border-b  border-dashed  border-gray-500 h-full rounded  " id = "firstdiv">
        <div class="bg-slate-600   top-title " >right</div>
        <div class="flex-grow w-full h-full flex flex-col space-y-2 pb-1 pt-1 px-1 "  id="scafather" >
          <!-- 使用 ScatterPCA 组件 -->
          <div class="scatter-container border" :style="scatterStyle" id = 'topdiv'>
            <scatterPCA :containerWidth="containerWidth" :containerHeight="containerHeight" />
          </div>
          <div class="scatter-container border " :style="scatterStyle" id = 'bottomdiv'>
            <scatterPCAcom :containerWidth="containerWidth" :containerHeight="containerHeight " />
          </div>
        </div>
      </div>
    </div>
    <div class="h-2/5  border-b border-l border-r border-gray-500 p-1 relative">
        <div class="bg-slate-600   top-title">bottom</div>  
        <div class = "px-6 py-4">
          <parallercop></parallercop>
        </div>
        </div>
    </div>
</template>
<script setup  lang="ts">
import * as echarts from "echarts";
import TheW from "./pages/homepage.vue"
import { defineComponent ,onMounted,ref} from 'vue';
import scatterPCA from "./components/scatter_PCA.vue";
import scatterPCAcom from "./components/scatter_2.vue";
import SquareGrid from "./components/SquareGrid.vue";
import parallel from "./components/parallel.vue";
import parallercop from "./components/parallerchart.vue"
// ... 其他代码
// const containerWidth = ref<number>(0);
// const containerHeight = ref<number>(0);
const scatterWidth = ref<number>(0);
const scatterHeight = ref<number>(0);
const scatterStyle = ref({});

const updateContainerSize = () => {
  const container = document.getElementById('scafather');
  if (container) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const gap = containerHeight*0.05;

    scatterWidth.value = (containerWidth);
    scatterHeight.value = (containerHeight-gap)/2;
    scatterStyle.value ={
      width:`${scatterWidth.value}px`,
      height:`${scatterHeight.value}px`
    }

  }
};

onMounted(() => {
  updateContainerSize();
  window.addEventListener('resize', updateContainerSize);
});
const App = defineComponent({
  components:{
    scatterPCA,
    scatterPCAcom,
    SquareGrid,
    // parallel,
    parallercop
  }
})
interface User {
  date: string
  name: string
  address: string
}

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: User
  rowIndex: number
}) => {
  if (rowIndex === 1) {
    return 'warning-row'
  } else if (rowIndex === 3) {
    return 'success-row'
  }
  return ''
}

const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Jarry',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Micky',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Windy',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
import {UsterStore}from "./store/user"
const user = UsterStore()
console.log(user.username)
console.log(user.getUsername)
  
      console.log("&&&&&&&")
      let username = "roy"
      let salary = 40000
      function addsalary(){
        salary += 1000
      }
import { VueElement } from 'vue'
const size = ref('default')
import type { FormProps } from 'element-plus'
import { reactive } from 'vue'
// import Scatter from "./pages/scatter.vue";
const labelPosition = ref<FormProps['labelPosition']>('right')

const formLabelAlign = reactive({
  name: '',
  region: '',
  type: '',
})
</script>


<style scoped>
a{
  margin: 10px;
}
.content-fill{
  flex:1;
  display:flex;
  flex-direction:column;
}
.top-title {
            width: 150px;
            height: 30px;
            background-color: rgb(64, 64, 64);
            position: relative;
            font-size: 18px;
            text-align: center;
            color: #fffefe;
            line-height: 30px;
}
#scafather {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: space-between;
}
.scatter-container{
  display:flex;
  align-items:center;
  justify-content: center;
}

</style>
