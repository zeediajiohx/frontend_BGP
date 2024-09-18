<template>
    <p>ID:{{query.id}}</p>
    <p>title:{{ query.title }}</p>
    <p>content:{{ query.content }}</p>
</template>
<script setup lang = "ts"> 
import { toRef } from 'vue';
import { useRoute } from 'vue-router';
let route = useRoute()
console.log(route.query)
console.log('parms',route.params )
let query = toRef(route,'query')
</script>