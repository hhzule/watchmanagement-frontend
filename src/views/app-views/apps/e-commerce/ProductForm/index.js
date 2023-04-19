import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Card, Tabs, Form, Button, message } from 'antd';
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
import { useLocation } from 'react-router-dom';
// import VariationField from './VariationField'
// import ShippingField from './ShippingField'
// import ProductListData from "assets/data/product-list.data.json"

// const getBase64 = (img, callback) => {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(img);
// }

const ADD = 'ADD'
const EDIT = 'EDIT'

const ProductForm = props => {

	const { mode = ADD, param } = props
	const location = useLocation()
	const lastSegmentId = location.pathname.split("/").pop();
	const [form] = Form.useForm();
	// const [uploadedImg, setImage] = useState('')
	// const [uploadLoading, setUploadLoading] = useState(false)
	const [submitLoading, setSubmitLoading] = useState(false)
	const [list, setList] = useState()

	useEffect(() => {
    	if(mode === EDIT) {
			console.log('is edit')
			// console.log('props', props)
			// const { id } = param
			// const produtId = parseInt(id)
			// const productData = ProductListData.filter( product => product.id === produtId)
			// const product = productData[0]
			// form.setFieldsValue({
			// 	comparePrice: 0.00,
			// 	cost: 0.00,
			// 	taxRate: 6,
			// 	description: 'There are many variations of passages of Lorem Ipsum available.',
			// 	category: product.category,
			// 	name: product.name,
			// 	price: product.price
			// });
			// setImage(product.image)
			const fetchData = async () =>{
				try {
					await fetch(`http://54.162.109.130/watches`)
						.then(response =>  response.json())
						.then((data) => {
							// console.log("result ==>" ,data)
							setList(data)
						});
				} catch (error) {
					console.log(error)	
				}
			}
	
			fetchData()
		}
  	}, [form, mode, param, props]);

	// const handleUploadChange = info => {
	// 	if (info.file.status === 'uploading') {
	// 		setUploadLoading(true)
	// 		return;
	// 	}
	// 	if (info.file.status === 'done') {
	// 		getBase64(info.file.originFileObj, imageUrl =>{
	// 			setImage(imageUrl)
	// 			setUploadLoading(true)
	// 		});
	// 	}
	// };

	const onFinish = () => {
		setSubmitLoading(true)
		form.validateFields().then(values => {
			setTimeout(async() => {
				setSubmitLoading(false)
				if(mode === ADD) {
					try {
						console.log("first", values)
						const requestOptions = {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({  
					       "name": values.name,
							"model": values.model,
							"owner": values.owner,
							"price": values.price,
							"status": "pending approval" })
						};
						await fetch('http://54.162.109.130/watch', requestOptions )
							.then(response =>  response.json())
							.then(data => console.log("result ==>" ,data));
						message.success(`Created ${values.name} to product list`);
					} catch (error) {
						message.success(`Created ${error} to product list`);
					}
					
				}
				if(mode === EDIT) {

					try {

							const requestOptions = {
								method: 'PUT',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({  
								"_id": lastSegmentId,
								"name": values.name,
								"model": values.model,
								"owner": values.owner,
								"price": values.price,
								"status": "pending approval" })
							};
							console.log("options", requestOptions)
							await fetch('http://54.162.109.130/watch', requestOptions )
								.then(response =>  response.json())
								.then(data => console.log("result ==>" ,data));
							message.success(`Edited ${values.name} to product list`);

					} catch (error) {
						// message.success(`Product saved`);
						console.log(error)
					}
				}
			}, 1500);
		}).catch(info => {
			setSubmitLoading(false)
			console.log('info', info)
			message.error('Please enter all required field ');
		});
	};

	return (
		<>
			<Form
				layout="vertical"
				form={form}
				name="advanced_search"
				className="ant-advanced-search-form"
				initialValues={{
					heightUnit: 'cm',
					widthUnit: 'cm',
					weightUnit: 'kg'
				}}
			>
				<PageHeaderAlt className="border-bottom" overlap>
					<div className="container">
						<Flex className="py-2" mobileFlex={false} justifyContent="space-between" alignItems="center">
							<h2 className="mb-3">{mode === 'ADD'? 'Add New Product' : `Edit Product`} </h2>
							<div className="mb-3">
								<Button className="mr-2">Discard</Button>
								<Button type="primary" onClick={() => onFinish()} htmlType="submit" loading={submitLoading} >
									{mode === 'ADD'? 'Add' : `Save`}
								</Button>
							</div>
						</Flex>
					</div>
				</PageHeaderAlt>
				<div className="container">
					<Tabs 
						defaultActiveKey="1" 
						style={{marginTop: 30}}
						items={[
							{
								label: 'General',
								key: '1',
								children: <GeneralField 
									// uploadedImg={uploadedImg} 
									// uploadLoading={uploadLoading} 
									// handleUploadChange={handleUploadChange}
								/>,
							},
							// {
							// 	label: 'Variation',
							// 	key: '2',
							// 	children: <VariationField />,
							// },
							// {
							// 	label: 'Shipping',
							// 	key: '3',
							// 	children: <ShippingField />,
							// },
						]}
					/>
				</div>
				{mode == EDIT && list?.length > 0 ? <Card title="Product">
				{list?.filter(obj=> obj._id == lastSegmentId).map((itm)=>{
					return(
						<div key={itm}>
							<p>name : {itm.name}</p>
							<p>owner : {itm.owner}</p>
							</div>
					)
				})}
				</Card> : null}
			</Form>
		</>
	)
}

export default ProductForm
