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
					await fetch(`/api/watches`)
					// await fetch(`http://54.91.128.179/watches`)
					
						.then(response =>  response.json())
						.then((data) => {
							// console.log("result ==>" ,data.filter(obj=> obj._id == lastSegmentId))
							const fetchedValues = data.filter(obj=> obj._id == lastSegmentId)
							setImage(fetchedValues[0].imgUrl)
							
							return setList(fetchedValues)
						});
				} catch (error) {
					console.log(error)	
				}
			}
	
			fetchData()
			
		}
  	}, [ mode, param, props]);


	const onDiscard = async () => {
		console.log("1")
		Promise.all([ setList([{}]),setImage()])		
	}

	const onFinish = async () => {
		setSubmitLoading(true)
		form.validateFields().then(values => {
			setTimeout(async() => {
				setSubmitLoading(false)
				if(mode === ADD) {
					console.log("imgObj", imgObj)
					if(imgObj){

		
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
									
									message.success(`Created ${values.name} to watches list`, [5]);
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
						message.success(`${error} creating list`);
					}
				}else{
					
					message.error('Please upload media');
				}
				}
				if(mode === EDIT) {
					if(imgObj){
						console.log("imgObj", imgObj)
						console.log("uploadedImg", uploadedImg)
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
							message.success(`Edited ${values.name} to watches list`, [5]);
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
					message.success(`Edited ${values.name} to watches list`, [5]);
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
				{ list?.length > 0 ? <Form
				layout="vertical"
				form={form}
				name="advanced_search"
				className="ant-advanced-search-form"
				initialValues={{
					heightUnit: 'cm',
					widthUnit: 'cm',
					weightUnit: 'kg'
				}}
				fields={[
					{
					  name: ["name"],
					  value: list[0].name,
					},
					{
						name: ["model"],
						value: list[0].model,
					  },
					  {
						name: ["price"],
						value: list[0].price,
					  },
					  {
						name: ["owner"],
						value:list[0].owner,
					  },
					  {
						name: ["status"],
						value: list[0].status,
					  },
					  {
						name: ["media"],
						value: list[0].imgUrl,
						// value: <img width={"150px"} height={"150px"} src={list[0]?.imgUrl} alt={list[0]?.name}></img>
					  }
				  ]}

			>
				<PageHeaderAlt className="border-bottom" overlap>
					<div className="container">
						<Flex className="py-2" mobileFlex={false} justifyContent="space-between" alignItems="center">
							<h2 className="mb-3">{mode === 'ADD'? 'Add New Watch' : `Edit Watch`} </h2>
							<div className="mb-3">
								<Button className="mr-2" onClick={() => onDiscard()} >Discard</Button>
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
									setList={setList}
								/>,
							},
						]}
					/>
				</div>

			</Form> : (<> <div></div></>) }
		</>
	)
}

export default ProductForm
