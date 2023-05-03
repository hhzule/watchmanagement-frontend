import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message, Card } from 'antd';
import Flex from 'components/shared-components/Flex'
import { useLocation } from 'react-router-dom';
import DealerField from './DealerField'
import CustomerField from "./CustomerField"
import { useNavigate } from "react-router-dom";

	

const ADD = 'ADD'
const EDIT = 'EDIT'

const CustomForm = props => {
	const navigate = useNavigate();
	const auth = localStorage.getItem("auth_token")
    const location = useLocation()
	const lastSegmentId = location.pathname.split("/").pop();
    const res = location.pathname.includes("dealer")
    const adminId = localStorage.getItem("auth_token") 
    const userApi = res ? "dealer" : "customer"
	const { mode = ADD, param } = props
	const [form] = Form.useForm();
	const [submitLoading, setSubmitLoading] = useState(false)
	const [list, setList] = useState()

	useEffect(() => {
    	if(mode === EDIT) {
			const fetchData = async () =>{
            if(userApi == "dealer"){
	try {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ auth})
		};
		
		// await fetch(`/api/${userApi}s`, requestOptions )
		await fetch(`http://54.91.128.179/${userApi}s`, requestOptions )
			.then(response =>  response.json())
			.then((data) => {
				// console.log("result ==>" ,data)
				const filteredItem = data.filter(obj=> obj._id == lastSegmentId)
				setList(filteredItem)
			});
		
	} catch (error) {
		console.log(error)	
	}
	
}else if(userApi == "customer"){
	try {
		// await fetch(`/api/${userApi}s`)
		await fetch(`http://54.91.128.179/${userApi}s`)
			.then(response =>  response.json())
			.then((data) => {
				// console.log("result ==>" ,data)
				const filteredItem = data.filter(obj=> obj._id == lastSegmentId)
				setList(filteredItem)
			});	
	} catch (error) {
		console.log(error)	
	}
}
			}
	
			fetchData()
			
		}
  	}, [form, mode, param, props]);

	  const onDiscard = async () => {
		console.log("1")
		setList([{}])
	}
	const onFinish = () => {
		setSubmitLoading(true)
		form.validateFields().then(values => {
			setTimeout(async() => {
				
				let postBody;
				if(mode === ADD) {
					if(userApi == "dealer"){
						console.log("in dealer")
      					 postBody =
						{  
						   "email": values.email,
						   "name": values.name,
						   "auth": adminId,
						   "password": values.password
						   } 
							}else if(userApi == "customer"){
								console.log("in customer")
								
						postBody =	
									{  
									"email": values.email,
									"name": values.name,
									"password": values.password
									}
						}
					try {
                
							const requestOptions = {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(postBody)
						};
						console.log(requestOptions)
					
						// await fetch(`/api/${userApi}`, requestOptions )
							await fetch(`http://54.91.128.179/${userApi}`, requestOptions )
							.then(response =>  response.json())
							.then(data => console.log("add result ==>" ,data));
							setSubmitLoading(false)
						message.success(`Created ${values.name} to `, [3]);
						navigate(`/app/apps/watches/${userApi}-list`)
					} catch (error) {
						console.log(error)
						// message.success(`Created ${error.message} `);
					}
					
				}
				
				if(mode === EDIT) {
					if(userApi == "dealer"){
						console.log("values", values)
							console.log("one")
								   postBody =
								{  
								   "email": values.email,
								   "name": values.name,
								   "auth": adminId,
								   "_id": lastSegmentId
								   } 
									}else if(userApi == "customer"){
										console.log("two")
								postBody =	
											{  
											"email": values.email,
											"name": values.name,
											"commission": values.commission,
											"_id": lastSegmentId
											}
								}
					try {
						console.log("postBode", postBody)
								const requestOptions = {
									method: 'PUT',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify(postBody)
								};
								console.log("options", requestOptions)
								// await fetch(`/api/${userApi}`, requestOptions )
									await fetch(`http://54.91.128.179/${userApi}`, requestOptions )
									.then(response =>  response.json())
									.then((data) => {
										console.log("result ==>" ,data)
										return setList([data])}
										);
									setSubmitLoading(false)
									
									
								message.success(`Edited ${values.name}`, [3]);
								navigate(`/app/apps/watches/${userApi}-list`)

					} catch (error) {
						message.error(error.message);
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
						name: ["email"],
						value: list[0].email,
					  },
					  {
						name: ["password"],
						value: list[0].password,
					  }
				  ]}
			>
				<PageHeaderAlt className="border-bottom" overlap>
					<div className="container">
						<Flex className="py-2" mobileFlex={false} justifyContent="space-between" alignItems="center">
							<h2 className="mb-3">{mode === 'ADD'? `Add New ${userApi.toUpperCase()}` : `Edit ${userApi.toUpperCase()}`} </h2>
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
								children: res ? <DealerField mode={mode}/> : <CustomerField mode={mode}/> ,
							},
						]}
					/>
				</div>
			</Form> : (<> <div></div></>) }
		</>
	)
}

export default CustomForm
