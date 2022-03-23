import React from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import logo from '../../assets/images/logo.jpg'
import { reqLogin } from '../../api/index'
import memoryUtils from '../../utils/memoryUtils';
import localUtils from '../../utils/localUtils';
import { Navigate,useNavigate } from 'react-router-dom';
import './index.less'
export default function Login() {
  const user = localUtils.getUser()
  const navigate=useNavigate()
  const formRef=React.useRef()
  function onFinish(){
    const {current:LoginForm}=formRef
    LoginForm.validateFields()
      .then(async (values) => {
        const { username, password } = values
        const result = await reqLogin(username, password)
        if (result.status === 0) {
          message.success('登录成功')
          const user = result.data
          memoryUtils.user = user
          localUtils.saveUser(user)
          navigate('/',{replace:true})
        } else {
          message.error(result.msg)
        }
      }).catch((errinfo) => {
        console.log(errinfo);
      })

  }
  function validatePwd(rules, value, callback){
    if (!value) {
      callback('密码不能为空')
      // eslint-disable-next-line
    } else if (!/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[\-_#@])^(?!.*[!$%^&*()=+~`\[\]{}|;:'"?/<>,.]).{8,20}$/.test(value)) {
      callback("密码只能为8-20位并且只能包括'-_#@'这四种特殊字符")
    } else {
      callback()
    }
  }
  if (user && user._id) {
    memoryUtils.user=user
    return <Navigate to='/' />
  }
  return (
    <div className='loginDiv'>
      <header className="loginHeader">
        <img src={logo} alt="logo img" />
        <h1>zjx后台管理系统</h1>
      </header>
      <section className="loginContent">
        <h2>用户登录</h2>
        <Form
          ref={formRef}
          name="loginForm"
          labelCol={{
            offset: 0
          }}
          wrapperCol={{
            span: 24,
          }}
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            username: 'zjx123',
            password: 'backendPass@1'
          }}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                whitespace: true,
                message: '用户名不能为空',
              },
              {
                min: 4,
                message: '用户名最少是4位'
              },
              {
                max: 12,
                message: '用户名最多是12位'
              },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: '用户名必须由英文、数字、下划线组成'
              }
            ]}
          >
            <Input prefix={<UserOutlined />} style={{ color: 'rgba(0,0,0,.25)' }} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              // {
              //   required: true,
              //   message: 'Please input your password!',
              // },
              // {
              //   // eslint-disable-next-line
              //   pattern:/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[\-_#@])^(?!.*[!$%^&*()=+~`\[\]{}|;:'"?/<>,.]).{8,20}$/,
              //   message:"用户名密码只能为8-20位并且只能包括'-_#@'这四种特殊字符,出现其他特殊字符出错"
              // }
              {
                validator: validatePwd
              }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} style={{ color: 'rgba(0,0,0,.25)' }} placeholder="密码" />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 24
            }}
          >
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  )
}
