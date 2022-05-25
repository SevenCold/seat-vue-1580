import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import VueAxios from 'vue-axios'
import { ElMessage } from 'element-plus'

// 请求服务器具体的地址
axios.defaults.baseURL = 'http://localhost:8910/';
//axios.defaults.baseURL = 'https://www.goobad.cn/seat/syzhk/api/';
//axios.defaults.headers['Content-Type'] = 'application/json';
//axios.defaults.timeout=10000;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    ElMessage.error('请求服务器数据错误');
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    ElMessage.error('请求服务器数据错误');
    return Promise.reject(error);
});

createApp(App)
    .use(router)
    .use(ElementPlus, {
        locale: zhCn,
    })
    .use(VueAxios, axios)
    .mount('#app')
