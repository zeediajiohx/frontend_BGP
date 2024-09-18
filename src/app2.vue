<template>
  <html lang="en" class="text-gray-900 bg-gray-100 font-serif">
  <!-- ... -->
</html>

  <div class="flex  flex-col space-y-4   h-screen ">
     <!-- top -->
    <div class="h-2/3  flex space-x-4 ">
      <!-- top left -表单  -->
      <div class="w-1/4  px-6 py-4  bg-blue-200 border-dashed rounded border border-blue-500 hover:bg-sky-500 h-full  ">
        <div>
          <div class="bg-slate-600  pl-8 top-title">left</div>
        </div>
        
        <div class="content px-4  w-full  h-full ">


          <el-space direction="vertical" alignment="start" :size=" 30" class="w-full center h-full  flex py-0 first:pt-2 last:pb-2   active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 item-center"   >
    
            <el-radio-group v-model="size" class="center mt-2  hover:bg-violet-600 dark:text-white text-slate-900 group-hover:text-white text-sm font-semibold">
      <el-radio value="large">Large</el-radio>
      <el-radio value="default">Default</el-radio>
      <el-radio value="small">Small</el-radio>
    </el-radio-group>
    <div class=" w-fit overflow-hidden overflow-y-auto h-1/2 px-6 hover:bg-violet-600">
      <el-space wrap :size="size"  class=" w-fit items-center text-slate-500   text-sm"   >
      <el-card v-for="i in 4" :key="i" class="center  w-full hover:ring-sky-500 box-card dark:text-white border-dashed" style="width: 250px">
        <template #header>
           <div class="center card-header">
            <span>Option </span>
            <el-form
    :label-position="labelPosition"
    label-width="auto"
    :model="formLabelAlign"
    style="max-width: 600px"
  >
    <el-form-item label="Time">
      <el-input v-model="formLabelAlign.name" />
    </el-form-item>
    <el-form-item label=" zone">
      <el-input v-model="formLabelAlign.region" />
    </el-form-item>
    <el-form-item label="Activity form">
      <el-input v-model="formLabelAlign.type" />
    </el-form-item>
  </el-form>
            <!-- <el-button class="button" text>Operation button</el-button> -->
          </div>
        </template>
        <div v-for="o in 2" :key="o" class="text item">
          {{ 'List item ' + o }}
        </div>
      </el-card>
    </el-space>
    </div>

    
  </el-space>

        </div>
        
      </div>
      <!-- top center -主图  -->

      <div class = "w-1/2  px-6 py-4 bg-green-200 border-dashed border border-green-500 rounded hover:bg-sky-500  relative   ">
        
        <div class="bg-slate-600   top-title">center</div>
        02
      </div>

      <!-- top right -散点 -->
      <div class="w-1/4  px-6 py-4 border-dashed border border-yellow-500 rounded relative  ">
        <div class="bg-slate-600 top-title">right</div>
       
        <div class="w-full h-full" :ref="(el) => fScatter = el" id="scafather">
          <!-- 使用 ScatterPCA 组件 -->
          <scatterPCA :containerWidth="scatterWidth" :containerHeight="scatterHeight"/>
        </div>
      </div>

    </div>

    <!-- bottom -->
    <div class="h-1/3 px-6 py-4 bg-gray-200 border-t border-dashed rounded border-gray-500 relative">
      <div class="bg-slate-600   top-title">bottom</div>
        <div class="px-6 py-4 hover:bg-sky-500">

          <el-table    :data="tableData"    style="width: 100%"    :row-class-name="tableRowClassName"
    >
            <el-table-column prop="date" label="Date" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="address" label="Address" />
          </el-table> 
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
import { defineComponent ,onMounted} from "vue";

import scatterPCA from "./components/scatter_PCA.vue";

// ... 其他代码
const scatterWidth = ref("0px");
const scatterHeight = ref("0px");
const fScatter = ref(null);
onMounted(() => {
  console.log(fScatter.value.offsetWidth); // 应该打印出非零的宽度
  scatterWidth.value = `${fScatter.value.offsetWidth}px`;
  scatterHeight.value = `${fScatter.value.offsetHeight}px`;
});
console.log("hei,wig:",scatterHeight.value,scatterWidth.value)
// const scatterWidth = this.$refs.f_scat.offsetWidth;

// const scatterHeight = this.$refs.f_scat.offsetHeight;
const App = defineComponent({
  components:{
    scatterPCA,
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
import { VueElement, ref } from 'vue'
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
<style  >
a{
  margin: 10px;
}
.content{
   
  

}
.top-title {
  width: 150px;
            height: 30px;
            background-color: rgb(140, 141, 141);
            position: relative;
            font-size: 18px;
            text-align: center;
            line-height: 30px;

}
.top-title::after{
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
 
}

</style>
