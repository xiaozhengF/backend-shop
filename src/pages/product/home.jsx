import React,{useState,useEffect} from 'react'
import {
  Card,
  Select,
  Input,
  Button,
  Table,
  message
} from 'antd'
import {useNavigate} from 'react-router-dom'
import {PlusOutlined} from '@ant-design/icons'
import LinkButton from '../../components/LinkButton'
import {reqProductList,reqSearchProductList,reqUpdateStatus} from '../../api'
const Option=Select.Option
export default function ProductHome() {
  const navigate=useNavigate()
  const [data,setData]=useState([])
  const [pageSize,setPageSize]=useState(2)
  const [pageNum,setPageNum]=useState(1)
  const [total,setTotal]=useState(0)
  const [isLoading, setLoading] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [searchType, setSearchType] = useState('productName')
  const extraNode = (
    <Button type='primary' icon={<PlusOutlined />} onClick={()=>navigate('addupdate')}>添加</Button>
  )
  const columns=[
    {
      title:'商品名称',
      dataIndex: 'name'
    },
    {
      title:'商品描述',
      dataIndex: 'desc'
    },
    {
      title:'价格',
      dataIndex: 'price',
      render:(price)=>'$'+price
    },
    {
      width:90,
      title:'状态',
      render:({_id,status})=>{
        return (
          <span>
            <Button type='primary' onClick={()=>updateStatus(_id,status===1 ? 2 : 1)}>{status===1?'下架':"上架"}</Button>
            <span>{status===1?'在售':"已下架"}</span>
          </span>
        )
      }
    },
    {
      width:70,
      title:'操作',
      render:(productObj)=>{
        return(
          <span>        
            <LinkButton onClick={()=>navigate('detail',{state:productObj})}>详情</LinkButton>
            <LinkButton onClick={()=>navigate('addupdate',{state:productObj})}>修改</LinkButton>
          </span>
        )
      }
    }
  ]
  async function getProductList(){
    setLoading(true)
    let result
    if(searchName===''){
      result=await reqProductList(pageSize,pageNum)
    }else{
      result=await reqSearchProductList({pageSize,pageNum,searchName,searchType})
    }
    if (result.status === 0) {
      const {total,list}=result.data
      setData(list)
      setTotal(total)
    } else {
      message.error('获取商品列表失败')
    }
    setLoading(false)
  }
  function handlePageChange(Page){
    setPageNum(Page.current)
    setPageSize(Page.pageSize)
  }
  async function updateStatus(productId,status){
    const result=await reqUpdateStatus(productId,status)
    if (result.status === 0) {
      message.success('更新商品状态成功')
      getProductList()
    } else {
      message.error('获取商品列表失败')
    }
  }
  useEffect(()=>{
    console.log('home mounted');
    getProductList()
  },[pageSize,pageNum])
  const title= (
    <span>
      <Select value={searchType} onChange={(value)=>setSearchType(value)}>
        <Option value='productName'>按名称搜索</Option>
        <Option value='productDesc'>按描述搜索</Option>
      </Select>
      <Input placeholder='关键字' allowClear  style={{width:150,margin:'0 15px'}} onChange={(e)=>setSearchName(e.target.value)} value={searchName}></Input>
      <Button type='primary'onClick={()=>getProductList()}>查找</Button>
    </span>
  )
  return (
    <Card title={title} extra={extraNode}>
      <Table rowKey='_id' dataSource={data} columns={columns} bordered isLoading={isLoading}
      pagination={
        { 
          total:total,
          defaultPageSize: pageSize, 
          pageSizeOptions: [2, 10, 15], 
          showSizeChanger: true, 
          showQuickJumper: true 
        }
      }
      onChange={handlePageChange}
      >
      </Table>
    </Card>
  )
}
