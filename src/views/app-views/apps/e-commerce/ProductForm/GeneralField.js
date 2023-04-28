import React from 'react'
import { Input, Row, Col, Card, Form,Upload,InputNumber, message, Select } from 'antd';
import { ImageSvg } from 'assets/svg/icon';
import CustomIcon from 'components/util-components/CustomIcon'
import { LoadingOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Option } = Select;

const rules = {
	name: [
		{
			required: true,
			message: 'Please enter product name',
		}
	],
	description: [
		{
			required: true,
			message: 'Please enter product model',
		}
	],
	price: [
		{
			required: true,
			message: 'Please enter product price',
		}
	],
	owner: [
		{
			required: true,
			message: 'Please enter product owner',
		}
	],
	status: [
		{
			required: true,
			message: 'Please enter product status',
		}
	],
	media: [
		{
			required: true,
			message: 'Please upload picture',
		}
	],
}

const imageUploadProps = {
  	name: 'file',
	multiple: false,
	listType: "picture-card",
	showUploadList: false
//   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76'
}




const dummyRequest = ({ file, onSuccess }) => {

	setTimeout(() => {
	  onSuccess("ok");
	}, 0);
  };

const beforeUpload = file => {
	console.log("img before upload", file)
	if (!isJpgOrPng) {
		message.error('You can only upload JPG/PNG file!');
	  }
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const GeneralField = props => {
	
	const getBase64 = (img, callback) => {
		console.log("img", img)
	  const reader = new FileReader();
	  reader.addEventListener('load', () => callback(reader.result));
	  reader.readAsDataURL(img);
	}
	const handleUploadChange = info => {
		console.log("info", info)
		if (info.file.status === 'uploading') {
			props.setUploadLoading(true)
			return;
		}
		if (info.file.status === 'done') {
			console.log("info.file.originFileObj", info.file.originFileObj)
			props.setImgObj(info.file.originFileObj)
			getBase64(info.file.originFileObj, imageUrl =>{
				props.setImage(imageUrl)
				props.setUploadLoading(true)
			});
		}
	};
	return(
	<Row gutter={16}>
		<Col xs={24} sm={24} md={17}>
			<Card title="Basic Info">
				<Form.Item name="name" label="Product name" rules={rules.name}>
					<Input placeholder="Product Name" />
				</Form.Item>
				<Form.Item name="model" label="Model" 
				rules={rules.description}
				>
					<Input placeholder="Model" />
					
				</Form.Item>
				<Form.Item name="owner" label="Owner" 
						rules={rules.owner}
						>
							<Input placeholder="Product Name" />
						</Form.Item>

						<Form.Item name="status" label="Status" 
						rules={rules.status}
						>
							<Input placeholder="Product Status" />
						</Form.Item>
			</Card>
			<Card title="Pricing">
				<Row gutter={16}>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="price" label="Price" rules={rules.price}>
						<InputNumber
							className="w-100"
							formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={value => value.replace(/\$\s?|(,*)/g, '')}
						/>
						</Form.Item>
					</Col>
				</Row>
			</Card>
		</Col>
		<Col xs={24} sm={24} md={7}>
			<Card title="Media">
				<Dragger {...imageUploadProps} customRequest={dummyRequest} beforeUpload={beforeUpload} onChange={e=> handleUploadChange(e)} >
					{
						props.uploadedImg ? 
						<img src={props.uploadedImg} alt="avatar" className="img-fluid" /> 
						: 
						<div>
							{
								props.uploadLoading ? 
								<div>
									<LoadingOutlined className="font-size-xxl text-primary"/>
									<div className="mt-3">Uploading</div>
								</div> 
								: 
								<div>
									<CustomIcon className="display-3" svg={ImageSvg}/>
									<p>Click or drag file to upload</p>
								</div>
							}
						</div>
					}
				</Dragger>
			</Card>
			{/* <Card title="Organization">
				<Form.Item name="category" label="Category" >
					<Select className="w-100" placeholder="Category">
						{
							categories.map(elm => (
								<Option key={elm} value={elm}>{elm}</Option>
							))
						}
					</Select>
				</Form.Item>
				<Form.Item name="tags" label="Tags" >
				<Select mode="tags" style={{ width: '100%' }} placeholder="Tags">
					{tags.map(elm => <Option key={elm}>{elm}</Option>)}
				</Select>
				</Form.Item>
			</Card> */}
		</Col>
	</Row>
)}

export default GeneralField
