// import './assets/main.css'
import {createRouter, createWebHistory} from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'
import homepage from '@/pages/homepage.vue'
import detailpage from './pages/detailpage.vue'
import pardetail from './pages/pardetail.vue'
import {createPinia} from 'pinia'
import Elementui from 'element-plus'
import 'element-plus/dist/index.css'
const pinia = createPinia()

const routes = [
    {path:'/home',component:homepage , name:"page",
        children:[
            {
                path:"1",
                component:detailpage

            },
            {
                path: '/2/:id/:title/:content?',
                name: 'user',
                component: pardetail,

            }
           
        ]
    },
] 
const router = createRouter({
    history: createWebHistory(),
    routes
})
const app = createApp(App)
app.use(router)
app.use(Elementui)
app.use(pinia)
app.mount('#app')
// createApp(App).mount('#app')
