/*
    包含所有接口请求函数的模块
    返回值是一个promise对象
    分别暴露
*/
import ajax from "./ajax"
const BASE = '/reqApi'
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')
export const reqAddUser = userObj => ajax(BASE + '/manage/user/add', userObj, 'POST')
export const reqWeather = city => ajax(BASE + '/weather',{city},'POST')
export const reqCategorys = parentId => ajax(BASE + '/manage/category/list',{parentId})
export const reqAddCategory = ({parentId,categoryName}) => ajax(BASE + '/manage/category/add',{parentId,categoryName},'POST')
export const reqUpdateCategory =({categoryId,categoryName}) => ajax(BASE + '/manage/category/update',{categoryId,categoryName},'POST')
export const reqProductList =(pageSize,pageNum) => ajax(BASE + '/manage/product/list',{pageSize,pageNum})
export const reqSearchProductList =({pageSize,pageNum,searchName,searchType}) => ajax(BASE + '/manage/product/search',{pageSize,pageNum,[searchType]:searchName})
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})