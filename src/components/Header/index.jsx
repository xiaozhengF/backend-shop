import React, { useState } from 'react'
import { formatTime } from '../../utils/formatTimeUtils'
import { reqWeather } from '../../api'
import weatherImg from '../../assets/images/qing.png'
import LinkButton from '../LinkButton'
import './index.less'
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom'
import menuList from '../../config/menuconfig.js'
import memoryUtils from '../../utils/memoryUtils'
import localUtils from '../../utils/localUtils';
import useAsyncEffect from '../../utils/useAsyncEffect'
const { confirm } = Modal;
export default function Header(props) {
  let title = ''
  let [CurrentTime, setCurrentTime] = useState(formatTime(Date.now()))
  let [Weather, setWeather] = useState('')
  const { user: { username } } = props
  const { pathname } = useLocation()
  const navigate = useNavigate()
  function getTitle() {
    menuList.forEach(menuObj => {
      if (menuObj.key === pathname) title = menuObj.title
      else {
        if (menuObj.children) {
          const cmenuObj = menuObj.children.find(cmenuObj => {
            return cmenuObj.key === pathname
          })
          if (cmenuObj) title = cmenuObj.title
        }
      }
    })
  }
  function logOut() {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '确定登出么？',
      onOk() {
        localUtils.removeUser()
        memoryUtils.user = {}
        navigate('/login', {
          replace: true
        })
      }
    });
  }
  getTitle()
  useAsyncEffect(async () => {
    let timer = setInterval(() => {
      setCurrentTime(formatTime(Date.now()))
    }, 1000)
    const result = await reqWeather('莆田')
    if (result.error_code === 0) {
      const { realtime: { info } } = result.result
      setWeather(info)
    } else {
      message.error(result.reason)
    }
    return () => {
      clearInterval(timer)
    }
  }, [])
  return (
    <div className='HeaderWrap'>
      <div className='header_top'>
        <span>欢迎,{username}</span>
        <LinkButton onClick={logOut}>退出</LinkButton>
        {/* <a href="#" onClick={logOut}>退出</a> */}
      </div>
      <div className='header_bottom'>
        <div className='header_bottom_left'>{title}</div>
        <div className='header_bottom_right'>
          <span className='current_time'>{CurrentTime}</span>
          <img src={weatherImg} alt='weatherLogo' />
          <span className='weather'>{Weather}</span>
        </div>
      </div>
    </div>
  )
}
