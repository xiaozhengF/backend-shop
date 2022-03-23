import React, { useRef, useState, useEffect } from 'react'
import {
  Card,
  Form,
  Button,
  Input,
  Cascader,
  message
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/LinkButton'
import { useNavigate, useLocation } from 'react-router-dom'
import { reqCategorys } from '../../api'
const { Item } = Form
const { TextArea } = Input
export default function Addupdate() {
  let parentId = '0'
  const formRef = useRef()
  const [options, setOptions] = useState([])
  const [categoryIds, setCategoryIds] = useState([])
  const navigate = useNavigate()
  const { state: product } = useLocation()
  const isUpdate = !!product
  let productObj=isUpdate?product:[]
  const title = (
    <span>
      <LinkButton style={{ marginRight: 10 }} onClick={() => navigate(-1)}>
        <ArrowLeftOutlined style={{ fontSize: 20 }} />
      </LinkButton>
      <span>{isUpdate?'修改商品':"添加商品"}</span>
    </span>
  )
  const formItemLayout = {
    labelCol: {
      offset: 0,
      span: 2
    },
    wrapperCol: {
      span: 8
    },
  };
  function validatePrice(_, value) {
    if (value * 1 > 0) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('输入的价格必须大于0'));
  }
  function handleSubmit() {
    const { current: addUpdateForm } = formRef
    addUpdateForm.validateFields().then(() => {
      message.success('表单校验成功！！')
    }).catch((errinfo) => {
      console.log(errinfo);
    })
  }
  async function loadData(selectedOptions) {
    const TargetOption = selectedOptions[0]
    parentId = TargetOption.value
    TargetOption.loading = true;
    const subCategorys = await getCategorys()
    TargetOption.loading = false;
    if (subCategorys && subCategorys.length > 0) {
      const cOptions = subCategorys.map(sCobj => ({
        value: sCobj._id,
        label: sCobj.name,
        isLeaf: true
      }))
      TargetOption.children = cOptions
    } else {
      TargetOption.isLeaf = true
    }
    setOptions([...options])
  }
  async function initOptions(categorys) {
    const options = categorys.map(categoryObj => ({
      value: categoryObj._id,
      label: categoryObj.name,
      isLeaf: false
    }))
    const {pCategoryId,categoryId}=productObj
    const { current: addUpdateForm } = formRef
    if(isUpdate) {
      if(pCategoryId!=='0'){
      setCategoryIds([pCategoryId,categoryId])
      // 获取对应的二级分类列表
      parentId=pCategoryId
      const subCategorys = await getCategorys()
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value===pCategoryId)

      // 关联对应的一级option上
      targetOption.children = childOptions
      }else{
        setCategoryIds([categoryId])
      }
    }
    setOptions(options)
  }
  async function getCategorys() {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      if (parentId === "0") {
        initOptions(result.data)
      } else {
        return result.data
      }
    } else {
      message.error('获取商品分类列表失败！！')
    }
  }
  useEffect(() => {
    console.log('addupdate mounted');
    getCategorys()
    return () => {
    }
  }, [])
  useEffect(()=>{
    const { current: addUpdateForm } = formRef
    addUpdateForm&&addUpdateForm.setFieldsValue({'categoryIds':categoryIds})
  },[categoryIds])
  return (
    <Card title={title}>
      <Form {...formItemLayout} ref={formRef} labelAlign='left'
        initialValues={{
          name: productObj.name,
          desc: productObj.desc,
          price: productObj.price,
          categoryIds
        }}
      >
        <Item label='商品名称' name='name'
          rules={[
            { required: true, message: "必须输入商品名称" }
          ]}
        >
          <Input type='text' placeholder='请输入商品名称'></Input>
        </Item>
        <Item label='商品描述' name='desc'
          rules={[
            { required: true, message: "必须输入商品描述" }
          ]}
        >
          <TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder='请输入商品描述'></TextArea>
        </Item>
        <Item label='商品价格' name='price'
          rules={[
            { required: true, message: "必须输入商品价格" },
            { validator: validatePrice }
          ]}
        >
          <Input type='number' addonAfter='元' placeholder='请输入商品价格'></Input>
        </Item>
        <Item label='商品分类' name='categoryIds'
        >
          <Cascader options={options} loadData={loadData} changeOnSelect />
        </Item>
        <Item>
          <Button type='primary' onClick={handleSubmit}>提交</Button>
        </Item>
      </Form>
    </Card>
  )
}
