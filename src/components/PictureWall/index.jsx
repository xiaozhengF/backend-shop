import React,{Component} from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {reqdeleteImg} from '../../api'
import PropTypes from 'prop-types'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
    static propTypes = {
        imgs: PropTypes.array
      }
    
  constructor(props){
      super(props)
      this.state={
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: props.imgs?props.imgs.map((img,index)=>({
            uid:-index,
            name:img,
            status:'done',
            url:'http://localhost:5002/upload/'+img
        })):[]
      }
  }
    /*
  获取所有已上传图片文件名的数组
   */
  getImgs  = () => {
    return this.state.fileList.map(file => file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = async ({file,fileList }) => {
    if(file.status==='done'){
        const file=fileList[fileList.length-1]
        const {data:{name,url}}=file.response
        file.name=name
        file.url=url
    }else if(file.status==='removed'){
        const result=await reqdeleteImg(file.name)
        if(result.status===0){
            message.success('图片删除成功')
        }else{
            message.error('图片删除失败')
        }
    }
    this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          name='image'
          action="/reqApi/manage/img/upload"
          accept='image/*' 
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
