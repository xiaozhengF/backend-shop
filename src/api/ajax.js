/*
    公用的ajax请求函数
    封装axios请求函数
    返回值为一个promise对象
    优化:统一处理错误的结果,并返回直接返回response.data
*/

import axios from 'axios'
import { message } from 'antd'
export default function ajax(url, data = {}, method = "GET") {
    let promise
    return new Promise((resolve, reject) => {
        // 1. 执行异步ajax请求
        if (method === 'GET') { // 发GET请求
            promise = axios.get(url, { // 配置对象
                params: data // 指定请求参数
            })
        } else { // 发POST请求
            promise = axios.post(url, data)
        }
        promise.then(response => {
            resolve(response.data)
        }).catch(err => {
            message.error('请求出错了' + err.message)
        })
    })
}