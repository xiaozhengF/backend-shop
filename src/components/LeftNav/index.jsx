import React,{useState} from 'react'
import logo from '../../assets/images/logo.jpg'
import { Link , useLocation } from 'react-router-dom'
import { Menu } from 'antd';
import menuList from '../../config/menuconfig.js'
import './index.less'
const { SubMenu } = Menu;
export default function LeftNav() {
  let {pathname}=useLocation()
  let path=!pathname.indexOf('/products/product')?'/products/product':pathname
  let openKey
  const menuNodes=getMenuNodes_reduce(menuList)
  function getMenuNodes(menuList){
    return menuList.map(menuObj=>{
      if(!menuObj.children){
        return (
          <Menu.Item key={menuObj.key} icon={menuObj.icon}>
            <Link to={menuObj.key}>{menuObj.title}</Link>
          </Menu.Item>
        )
      }else {
        return (
          <SubMenu key={menuObj.key} icon={menuObj.icon} title={menuObj.title}>
            {getMenuNodes(menuObj.children)}
          </SubMenu>
        )
      }
    })
  }
  function getMenuNodes_reduce(menuList){
    let path=pathname
    return menuList.reduce((preObj,menuObj)=>{
      if(!menuObj.children){
        preObj.push((
        <Menu.Item key={menuObj.key} icon={menuObj.icon}>
          <Link to={menuObj.key}>{menuObj.title}</Link>
        </Menu.Item>
        ))
      }else{
        const citem=menuObj.children.find(subMenuItem=>!path.indexOf(subMenuItem.key))
        if(citem)openKey=menuObj.key
        preObj.push((
          <SubMenu key={menuObj.key} icon={menuObj.icon} title={menuObj.title}>
          {getMenuNodes_reduce(menuObj.children)}
        </SubMenu>
        ))
      }
      return preObj
    },[])
  }
  return (
    <div className='Left_Nav'>
      <Link className='left_nav_header' to='/'>
        <img src={logo} alt="logo" />
        <h1>zjx后台管理</h1>
      </Link>
      <Menu
        selectedKeys={[path]}
        defaultOpenKeys={[openKey]}
        mode="inline"
        theme="dark"
      >
        {menuNodes}
      </Menu>
    </div>
  )
}
