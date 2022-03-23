import React, { useState,useEffect} from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import { ArrowRightOutlined,PlusOutlined} from '@ant-design/icons'
import LinkButton from '../../components/LinkButton'
import AddForm from './AddForm';
import UpdateForm from './UpdateForm';
import { reqAddCategory, reqCategorys, reqUpdateCategory } from '../../api'
let UpdateFormObj=null
let AddFormObj=null
let categoryObj={}
export default function Category() {
  const [isLoading, setLoading] = useState(false)
  const [parentId, setParentId] = useState("0")
  const [parentName, setparentName] = useState('')
  const [parentCategory,setparentCategory]=useState([])
  const [subCategory,setsubCategory]=useState([])
  const [modelVisible, setModelVisible] = useState(0)
  const extraNode = (
    <Button type='primary' icon={<PlusOutlined />} onClick={showAdd}>添加</Button>
  )
  const title = !parseInt(parentId) ? '一级分类列表' : (
    <>
      <LinkButton onClick={showCategorys}>一级分类列表</LinkButton>
      <ArrowRightOutlined style={{ margin: '0px 5px' }} />
      <span>{parentName}</span>
    </>
  )
  const columns = [
    {
      title: '类名',
      dataIndex: 'name'
    },
    {
      title: '操作',
      width: 300,
      dataIndex: '',
      render: (category) => (
        <span>
          <LinkButton onClick={()=>{showUpdate(category)}}>修改分类</LinkButton>&nbsp;&nbsp;
          {!parseInt(parentId) ? <LinkButton onClick={() => showSubCategorys(category)}>查看子分类</LinkButton> : null}
        </span>
      ),
    },
  ];
  useEffect(()=>{
    getCateGory()
  },[parentId])
  useEffect(()=>{
    if(AddFormObj&&modelVisible===1){
      AddFormObj.setFieldsValue({'parentId':parentId})
    }
    if(UpdateFormObj&&modelVisible===2){
      UpdateFormObj.setFieldsValue({'categoryName':categoryObj.name})
    }
  },[modelVisible])
  function showSubCategorys(category) {
    setParentId(category._id)
    setparentName(category.name)
  }
  function showCategorys() {
    setParentId('0')
    setparentName('')
  }
  function showAdd() {
    setModelVisible(1)
  }
  function showUpdate(category) {
    setModelVisible(2)
    categoryObj=category
  }
  function handleAdd(){
    AddFormObj.validateFields()
    .then(async(values)=>{
      setModelVisible(0)
      const {categoryName,parentId}=values
      const result=await reqAddCategory({parentId,categoryName})
      if(!result.status){
        message.success('添加新分类成功')
        getCateGory()
      }
      else{
        message.info('添加新分类失败！！！！')
      }
    })
    .catch((errinfo) => {
      console.log('errinfo',errinfo);
    })

  }
  async function handleUpdate(){
    UpdateFormObj.validateFields()
    .then(async values=>{
      const {categoryName}=values
      const categoryId=categoryObj._id
      setModelVisible(0)
      const result=await reqUpdateCategory({categoryId,categoryName})
      if(!result.status){
        message.success('更改分类名称成功')
        getCateGory()
      }else{
        message.info('更改分类名称失败')
      }
    }).catch((errinfo)=>{
      console.log(errinfo);
      })


  }
  function handleCancel(){
    if(modelVisible===1)AddFormObj.resetFields()
    if(modelVisible===2)UpdateFormObj.resetFields()
    setModelVisible(0)
  }
  function setAddForm(FormRef){
    AddFormObj=FormRef.current
  }
  function setUpdateForm(FormRef){
    UpdateFormObj=FormRef.current
  }
  async function getCateGory(){
    setLoading(true)
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      if(parentId==='0'){
        setparentCategory(result.data)
      }else{
        setsubCategory(result.data)
      }
    } else {
      message.error('获取商品分类列表失败')
    }
    setLoading(false)
  }
  return (
    <Card title={title} extra={extraNode}>
      <Table
        loading={isLoading}
        dataSource={parentId==='0'?parentCategory:subCategory}
        columns={columns}
        bordered
        rowKey='_id'
        pagination={{ defaultPageSize: 5, pageSizeOptions: [5, 10, 15], showSizeChanger: true, showQuickJumper: true }}
      />
      <Modal title="Add Form" visible={modelVisible===1} onOk={handleAdd} onCancel={handleCancel}>
        <AddForm dataSource={parentCategory} setForm={setAddForm}/>
      </Modal>
      <Modal  title="Update Form" visible={modelVisible===2} onOk={handleUpdate} onCancel={handleCancel}>
        <UpdateForm category={categoryObj} setForm={setUpdateForm}/>
      </Modal>
    </Card>
  )
}
