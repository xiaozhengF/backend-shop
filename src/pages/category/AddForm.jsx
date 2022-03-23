import React, { useRef,useEffect } from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'
const Item=Form.Item
const Option=Select.Option
AddForm.propTypes={
  dataSource:PropTypes.array.isRequired,
  setForm:PropTypes.func.isRequired
}
export default function AddForm(props) {
  const {dataSource,setForm} = props
  const FormRef=useRef()
  useEffect(() => {
    setForm(FormRef)
  }, [])
  return (
    <Form
    layout='vertical'
    ref={FormRef}
    >
        <Item 
        name='parentId'
        label='所属分类'
        >
            <Select>
                <Option value="0" key={"0"}>一级分类</Option>
                {
                  dataSource.map(dataObj=>{
                    return (
                      <Option value={dataObj._id} key={dataObj._id}>{dataObj.name}</Option>
                    )
                  })
                }
            </Select>
        </Item>
        <Item 
        name='categoryName'
        label='分类名称'
        initialValue=""
        rules={[
          {required: true, message: '分类名称必须输入'}
        ]}
        >
            <Input placeholder='请输入分类名称'></Input>
        </Item>
    </Form>
  )
}
