<template>
    
    <ul>
        <li>
            <RouterLink to="/home/1?id=1&title=news1&content=adadfaf">news1</RouterLink>
        </li>
        <li><RouterLink :to="{name:'user',params:{id:'2',title:'news2',content:'adsaeaet'}}">ffff</RouterLink></li>
         
    </ul>
    <div class="news-content">
        <RouterView></RouterView>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const size = ref('default')

</script>

<style scoped >
.news-content{
    background-color: rgb(57, 209, 138);
    height: 80%;
}
.demo-border .text {
  width: 15%;
}
.demo-border .line {
  width: 70%;
}
.demo-border .line div {
  width: 100%;
  height: 0;
  border-top: 1px solid var(--el-border-color);
}
.demo-border .line .dashed {
  border-top: 2px dashed var(--el-border-color);
}
/* .line div {
  width: 100%;
  height: 0;
  border-top: 1px solid var(--el-border-color);
}
.dashed {
  border-top: 2px dashed var(--el-border-color);
}
.demo-border .text {
  width: 15%;
}
.demo-border .line {
  width: 70%;
} */
</style>