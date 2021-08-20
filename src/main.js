import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import { ElMessage } from 'element-plus'

// 请求服务器具体的地址
axios.defaults.baseURL = 'http://localhost:8903/';
// 还需要改 vue.config.js 的 publicPath
//axios.defaults.baseURL = 'https://www.goobad.cn/seat/1580/api/';
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.timeout=10000;

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
    .use(ElementPlus, { locale })
    .use(VueAxios, axios)
    .mount('#app')
