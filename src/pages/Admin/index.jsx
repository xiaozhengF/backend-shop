import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
// import memoryUtils from '../../utils/memoryUtils'
import localUtils from '../../utils/localUtils';
import { Layout } from 'antd';
import LeftNav from '../../components/LeftNav';
import Header from '../../components/Header';
import './index.less'
const { Footer, Sider, Content } = Layout;
export default function Admin() {
  const user = localUtils.getUser()
  if (!user || !user._id) {
    return <Navigate to='/login' />
  }
  return (
    <Layout className='AdminWrap'>
      <Sider>
        <LeftNav />
      </Sider>
      <Layout>
        <Header user={user}/>
        <Content style={{ margin:20,marginBottom:0,backgroundColor: '#fff' }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center', color: '#cccccc' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
      </Layout>
    </Layout>
  )
}
