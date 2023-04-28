import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Card, Tabs, Form, Button, message , Row, Col} from 'antd';
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
import { useLocation } from 'react-router-dom';
import WatchImg from "../../../../../assets/svg/watch.jpeg"
import { getStorage, ref, uploadString , getDownloadURL} from "firebase/storage";
import { useNavigate } from "react-router-dom";

// Create a root reference
const storage = getStorage();

const ADD = 'ADD'
const EDIT = 'EDIT'

const ProductForm = props => {
	const navigate = useNavigate();
	const { mode = ADD, param } = props
	const location = useLocation()
	const lastSegmentId = location.pathname.split("/").pop();
	const [form] = Form.useForm();
	const [uploadedImg, setImage] = useState('')
	const [imgObj, setImgObj] = useState('')
	const [uploadLoading, setUploadLoading] = useState(false)
	const [submitLoading, setSubmitLoading] = useState(false)
	const [fileUrl, setFileUrl] = useState("")
	const [list, setList] = useState()

	useEffect(() => {
    	if(mode === EDIT) {
			const fetchData = async () =>{
				try {
					// await fetch(`/api/watches`)
					await fetch(`http://54.91.128.179/watches`)
					
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


	const onFinish = async () => {
		setSubmitLoading(true)
		form.validateFields().then(values => {
			setTimeout(async() => {
				setSubmitLoading(false)
				if(mode === ADD) {
					try {
						try {
								// Create a reference to 'image'
								const imgRef = ref(storage, imgObj.name);
								const uploadTask = await uploadString(imgRef, uploadedImg, 'data_url').then((snapshot) => {
								console.log('Uploaded a data_url string!');
							
								});
								await getDownloadURL(imgRef)
								.then(async(url) => {
									console.log("url",url)
									setFileUrl(url)
									const requestOptions = {
										method: 'POST',
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify({  
									   "name": values.name,
										"model": values.model,
										"owner": values.owner,
										"price": values.price,
										"imgUrl" : url,
										"status": values.status})
									};
								console.log("optons", requestOptions)
									// await fetch('http://54.91.128.179/watch', requestOptions )
									await fetch('/api/watch', requestOptions )
										.then(response =>  response.json())
										.then(data => console.log("result ==>" ,data));
									
									message.success(`Created ${values.name} to product list`, [5]);
									navigate(`/app/apps/watches/product-list`)	
								})
								.catch((error) => {
								  // A full list of error codes is available at
								  // https://firebase.google.com/docs/storage/web/handle-errors
								  switch (error.code) {
									case 'storage/object-not-found':
									  // File doesn't exist
									  break;
									case 'storage/unauthorized':
									  // User doesn't have permission to access the object
									  break;
									case 'storage/canceled':
									  // User canceled the upload
									  break;
							  
									// ...
							  
									case 'storage/unknown':
									  // Unknown error occurred, inspect the server response
									  break;
								  }
								});
								
							
						} catch (error) {
							console.log("error loading", error)
							
						}


					} catch (error) {
						message.success(`${error} creating product list`);
					}
					
				}
				if(mode === EDIT) {
					if(imgObj){
						// console.log("imgObj", imgObj)
						// console.log("uploadedImg", uploadedImg)
					try {
					 			const imgRef = ref(storage, imgObj.name);
								const uploadTask = await uploadString(imgRef, uploadedImg, 'data_url').then((snapshot) => {
								console.log('Uploaded a data_url string!');
							
								});
								await getDownloadURL(imgRef)
								.then(async(url) => {
									console.log("url",url)
									setFileUrl(url)
									const requestOptions = {
										method: 'PUT',
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify({  
										"_id": lastSegmentId,
									   "name": values.name,
										"model": values.model,
										"owner": values.owner,
										"price": values.price,
										"imgUrl" : url,
										"status": values.status })
									};
									
							console.log("options", requestOptions)
							await fetch('/api/watch', requestOptions )
							// await fetch('http://54.91.128.179/watch', requestOptions )
								.then(response =>  response.json())
								.then(data => console.log("result ==>" ,data));
							message.success(`Edited ${values.name} to product list`, [5]);
							navigate(`/app/apps/watches/product-list`)	
								})
					} catch (error) {
						// message.success(`Product saved`);
						console.log(error)
					}
				}
			else{
				// console.log("list", list)
				const img = list?.filter(obj=> obj._id == lastSegmentId)
				console.log("list", img[0].imgUrl)
				const requestOptions = {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({  
					"_id": lastSegmentId,
				   "name": values.name,
					"model": values.model,
					"owner": values.owner,
					"price": values.price,
					"imgUrl" : img[0].imgUrl,
					"status": values.status })
				};
				try {
					console.log("options", requestOptions)
					await fetch('/api/watch', requestOptions )
					// await fetch('http://54.91.128.179/watch', requestOptions )
						.then(response =>  response.json())
						.then(data => console.log("result ==>" ,data));
					message.success(`Edited ${values.name} to product list`, [5]);
					navigate(`/app/apps/watches/product-list`)	
				} catch (error) {
					console.log("error", error)
				}
				
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
						{mode == EDIT && list?.length > 0 ? <Card title="Product">
				{list?.filter(obj=> obj._id == lastSegmentId).map((itm)=>{
					return(
						<div key={itm}>
	<Row gutter={16}>
		<Col xs={24} sm={24} md={17}>
			<Card >
<span>Name:</span><span> {itm.name}</span><br/>
<span>Model:</span><span> {itm.model}</span><br/>
<span>Owner:</span><span> {itm.owner}</span><br/>
<span>Price:</span><span> {itm.price}</span><br/>
<span>Status:</span><span> {itm.status}</span><br/> 
<img width={"150px"} height={"150px"} src={itm.imgUrl} alt={itm.name}></img>
			</Card>

		</Col></Row>
							</div>
					)
				})}
				</Card> : null}
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
									uploadedImg={uploadedImg} 
									uploadLoading={uploadLoading} 
									// handleUploadChange={handleUploadChange}
									setUploadLoading={setUploadLoading}
									setImage={setImage}
									setImgObj={setImgObj}
								/>,
							},
						]}
					/>
				</div>

			</Form>
		</>
	)
}

export default ProductForm
