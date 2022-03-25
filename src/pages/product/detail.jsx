import React,{useState} from 'react'
import {
  Card,
  List
} from 'antd'
import {
  ArrowLeftOutlined
} from '@ant-design/icons'
import { useLocation,useNavigate } from 'react-router-dom'
import LinkButton from '../../components/LinkButton'
import {reqCategory} from '../../api'
import useEffectAsync from '../../utils/useAsyncEffect'
const Item=List.Item
export default function Detail() {
  const navigate=useNavigate()
  const { state:{name,desc,price,imgs,detail,pCategoryId,categoryId} } = useLocation()
  const title = (
    <span>
      <LinkButton onClick={()=>navigate(-1)} style={{marginRight:10}}>
        <ArrowLeftOutlined/>
      </LinkButton>
      <span>商品详情</span>
    </span>
  )
  const [cname1,setCname1]=useState('')
  const [cname2,setCname2]=useState('')
  useEffectAsync(async() => {
    if(pCategoryId==='0') { // 一级分类下的商品
      const result = await reqCategory(categoryId)
      setCname1(result.data.name)
    } else { // 二级分类下的商品
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      setCname1(results[0].data.name)
      setCname2(results[1].data.name)
    }
    return () => {     
    }
  }, [])
  
  return (
    <Card title={title} className='product-detail'>
      <List>
        <Item className='ListItem'>
          <span className="left">商品名称:</span>
          <span>{name}</span>
        </Item>
        <Item className='ListItem'>
          <span className="left">商品描述:</span>
          <span>{desc}</span>
        </Item>
        <Item className='ListItem'>
          <span className="left">商品价格:</span>
          <span>{price}元</span>
        </Item>
        <Item className='ListItem'>
          <span className="left">所属分类:</span>
          <span>{cname1} {cname2 ? ' --> ' + cname2 : ''}</span>
        </Item>
        <Item className='ListItem'>
          <span className="left">商品图片:</span>
          <span>
            {
              imgs.map((img,i) => (
                <img
                  key={img}
                  src={`http://localhost:5002/upload/${img}`}
                  className="product-img"
                  alt="img"
                />
              ))
            }
          </span>
        </Item>
        <Item className='ListItem'>
          <span className="left">商品详情:</span>
          <span dangerouslySetInnerHTML={{ __html: detail }}>
          </span>
        </Item>
      </List>
    </Card>
  )
}
