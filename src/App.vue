<template>
  <html lang="en" class="text-gray-900 bg-gray-100 font-serif">
  <!-- ... -->
  </html>

  <div class="flex flex-col h-screen p-1">
  <!-- top -->
  <div class="h-3/5 flex border border-gray-500 w-full p-1">
    <!-- top left -表单  -->
    <div class="w-2/12 flex flex-col border-t border-l border-b border-dashed border-gray-500 h-full" id="tablecont">
      <div class="top-title">left</div>
      <assankey/>
      <!-- <div class="content-fill w-full h-full flex-grow overflow-hidden">
        <el-space
          direction="vertical"
          alignment="start"
          :size="30"
          class="w-full h-full flex py-0 first:pt-2 last:pb-2 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 items-center overflow-hidden"
        >
            <el-radio-group v-model="size" class="center w-full mt-2 hover:bg-violet-600 dark:text-white text-slate-900 group-hover:text-white text-sm font-semibold">
              <el-radio value="large">Large</el-radio>
              <el-radio value="default">Default</el-radio>
              <el-radio value="small">Small</el-radio>
            </el-radio-group>
            <div class="w-full overflow-hidden overflow-y-auto flex-grow px-6 hover:bg-violet-600">
              <el-space wrap :size="size" class="w-full items-center text-slate-500 text-sm">
                <el-card v-for="i in 4" :key="i" class="center w-full hover:ring-sky-500 box-card dark:text-white border-dashed" >
                  <template #header>
                    <div class="center card-header">
                      <span>Option </span>
                      <el-form :label-position="labelPosition" label-width="auto" :model="formLabelAlign" >
                        <el-form-item label="Time">
                          <el-input v-model="formLabelAlign.name" />
                        </el-form-item>
                        <el-form-item label="Zone">
                          <el-input v-model="formLabelAlign.region" />
                        </el-form-item>
                        <el-form-item label="Activity form">
                          <el-input v-model="formLabelAlign.type" />
                        </el-form-item>
                      </el-form>
                    </div>
                  </template>
                  <div v-for="o in 2" :key="o" class="text item">
                    {{ 'List item ' + o }}
                  </div>
                </el-card>
              </el-space>
            </div>
           
          </el-space>

        </div> -->
              
        </div>
      <!-- top center -主图  -->

      <div class = "w-6/12  border-dashed border border-gray-500    relative   ">
        <!-- hover:bg-sky-500 bg-green-200-->
        
        <div class="bg-slate-600   top-title">center</div>
       
        <assankey/>
      </div>

      <!-- top right -散点 -->
      <div class="w-4/12 border-t border-r border-b  border-dashed  border-gray-500 h-full rounded flex flex-col " id = "firstdiv">
        <div class="bg-slate-600   top-title " >right</div>
        
        <div class="content-fill flex-grow w-full  flex flex-col   px-1 "  id="scafather" >
          <!-- 使用 ScatterPCA 组件 -->
          <div class=''>
            <label for="columnRange">select Columns:</label>
            <select v-model="selectedColumnRange" @change="updateChart">
              <option value="2-8">Mulit-head Attention</option>
              <option value="9-17">Self Attention</option>
              <option value="18-27">LSTM</option>
            </select>
          </div>
          <div class="flex flex-row">
            <div class="scatter-container border flex" :style="scatterStyle" id = 'topdiv'>
            <scatterPCA :containerWidth="containerWidth" :containerHeight="containerHeight" />
          </div>
          <div class="scatter-container border flex" :style="scatterStyle" id = 'topdiv'>
            <scatterPCA2 :containerWidth="containerWidth" :containerHeight="containerHeight" />
          </div>

          </div>
          <div class=''>
            <label for="columnRange">select Columns:</label>
            <select v-model="selectedColumnRange" @change="updateChart">
              <option value="2-8">vol peer列</option>
              <option value="9-17">9-17列</option>
              <option value="18-27">18-27列</option>
            </select>
          </div>
          <div class="flex flex-row">
            <div class="scatter-container border " :style="scatterStyle" id = 'bottomdiv'>
              <scatterPCAcom :containerWidth="containerWidth" :containerHeight="containerHeight " />
            </div>
            <div class="scatter-container border " :style="scatterStyle" id = 'bottomdiv'>
              <scatterPCAcom2 :containerWidth="containerWidth" :containerHeight="containerHeight " />
            </div>
          </div>
          
          <!-- <scatterPCA :containerWidth="containerWidth" :containerHeight="containerHeight" /> -->
        </div>
      </div>

    </div>

    <!-- bottom -->

    <div class="h-2/5  border-b border-l border-r border-gray-500 p-1 relative">
        <div class="bg-slate-600   top-title">bottom</div>  
        <!-- 
        <div class="px-6 py-4 ">
          <el-table    :data="tableData"    style="width: 100%"    :row-class-name="tableRowClassName">
            <el-table-column prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="address" label="Address" />
          </el-table> 
        </div> -->
        <div class = "px-6 py-4">
          <parallercop></parallercop>
          <!-- <parallel></parallel> -->
        </div>
        
        
          
        <!-- <div>05</div> -->
        </div>
    </div>
  <!-- <div  class=" group block   rounded-lg p-6 bg-white ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-sky-500 hover:ring-sky-500 ">  
    
  
  </div> -->
   
</template>
<script setup  lang="ts">
import * as echarts from "echarts";
import TheW from "./pages/homepage.vue"
import { defineComponent ,onMounted,ref} from 'vue';

import scatterPCA from "./components/scatter_PCA.vue";
import scatterPCAcom from "./components/scatter_2.vue";
import scatterPCA2 from "./components/scatter_PCA2.vue";
import scatterPCAcom2 from "./components/scatter_PCA2.vue";
import SquareGrid from "./components/SquareGrid.vue";
import parallel from "./components/parallel.vue";
import parallercop from "./components/parallerchart.vue";
import assankey from "./components/ASLink_sankey.vue"
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
// const containerWidth = ref(window.innerWidth * 0.9);
// const containerHeight = ref(window.innerHeight * 0.9);
// const updateContainerSize = () => {
//   containerWidth.value = window.innerWidth * 0.9;
//   containerHeight.value = window.innerHeight * 0.9;
// };

// onMounted(() => {
//   window.addEventListener('resize', updateContainerSize);
// });
// const scatterWidth = this.$refs.f_scat.offsetWidth;

// const scatterHeight = this.$refs.f_scat.offsetHeight;
const App = defineComponent({
  components:{
    scatterPCA,
    scatterPCAcom,
    scatterPCA2,
    scatterPCAcom2,
    SquareGrid,
    // parallel,
    parallercop,
    assankey,
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
/* .chartsContent{
  position: absolute;
  box-sizing: border-box;
  clip-path: polygon(0% 0%,30% 0px,70% 50%,100% 50%,100% 100%,0 100%);
} */
/* .top-title{
  text-align: right;
  color: #fff;
  margin: 50px 50px 0;
  font-size: 40px;
  font-weight: 700;
} */
.content-fill{
  flex:1;
  height:501px;
  display:flex;
  flex-direction: column;
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
            clip-path: polygon(0 0, 100% 0, 100% 0%, 70% 100%, 0 100%);

}
/* .top-title::after{
  content: '';
            height: 0px;
            width: 0px;
            position: absolute;
            right: -30px;
            top: -30px;
            border-top: 30px solid rgba(0, 0, 0, 0);
            border-left: 30px solid rgba(0, 0, 0, 0);
            border-right: 30px solid rgba(0, 0, 0, 0);
            border-bottom: 30px solid rgb(140, 141, 141);
 
} */
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

/* #firstdiv{
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  /* margin-bottom: 0.5rem; 
} */

</style>
