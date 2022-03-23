import React,{useRef,useEffect} from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
UpdateForm.propTypes={
    category:PropTypes.object.isRequired,
    setForm:PropTypes.func.isRequired
}
export default function UpdateForm(props) {
    const FormRef=useRef()
    const {setForm}=props
    useEffect(() => {
        setForm(FormRef)
    }, [])
    return (
        <Form ref={FormRef}
        initialValues={{categoryName:''}}
        >
            <Item
                name='categoryName'
                rules={[
                    {required: true, message: '分类名称必须输入'}
                ]}
            >
                <Input placeholder='请输入分类名称'></Input>
            </Item>
        </Form>
    )
}
