import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message, Card } from 'antd';
import Flex from 'components/shared-components/Flex'
import { useLocation } from 'react-router-dom';
import DealerField from './DealerField'
import CustomerField from "./CustomerField"

const ADD = 'ADD'
const EDIT = 'EDIT'

const CustomForm = props => {
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
	
		await fetch(`/api/${userApi}s`, requestOptions )
			.then(response =>  response.json())
			.then((data) => {
				// console.log("result ==>" ,data)
				setList(data)
			});
		
	} catch (error) {
		console.log(error)	
	}

}else if(userApi == "customer"){
	try {
		await fetch(`/api/${userApi}s`)
			.then(response =>  response.json())
			.then((data) => {
				// console.log("result ==>" ,data)
				 setList(data)
			});	
	} catch (error) {
		console.log(error)	
	}
}
			}
	
			fetchData()
		}
  	}, [form, mode, param, props]);


	const onFinish = () => {
		setSubmitLoading(true)
		form.validateFields().then(values => {
			setTimeout(async() => {
				
				let postBody;
				if(mode === ADD) {
					if(userApi == "dealer"){
						console.log("in dealer")
                if(values.commission >= 5 && values.commission <= 16){
      					 postBody =
						{  
						   "email": values.email,
						   "name": values.name,
						   "company": values.company,
						   "commision": values.commission,
						   "auth": adminId,
						   "password": values.password
						   } 
							}}else if(userApi == "customer"){
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
					
						await fetch(`/api/${userApi}`, requestOptions )
							.then(response =>  response.json())
							.then(data => console.log("result ==>" ,data));
							setSubmitLoading(false)
						message.success(`Created ${values.name} to `);
					} catch (error) {
						console.log(error)
						// message.success(`Created ${error.message} `);
					}
					
				}
				
				if(mode === EDIT) {
					if(userApi == "dealer"){
						console.log("values", values)
						if(values.commission >= 5 && values.commission <= 16){
							console.log("one")
								   postBody =
								{  
								   "email": values.email,
								   "name": values.name,
								   "company": values.company,
								   "commision": values.commission,
								   "auth": adminId,
								   "_id": lastSegmentId
								   } 
									}}else if(userApi == "customer"){
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
								await fetch(`/api/${userApi}`, requestOptions )
									.then(response =>  response.json())
									.then((data) => {
										console.log("result ==>" ,data)
										return setList([data])}
										);
									setSubmitLoading(false)
									console.log("list", list)
									
								message.success(`Edited ${values.name}`);

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
							<h2 className="mb-3">{mode === 'ADD'? `Add New ${userApi.toUpperCase()}` : `Edit ${userApi.toUpperCase()}`} </h2>
							<div className="mb-3">
								{/* <Button className="mr-2">Discard</Button> */}
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
				{mode == EDIT && list?.length > 0 ? <Card title={userApi}>
				{list?.filter(obj=> obj._id == lastSegmentId).map((itm)=>{
					return(
						<div key={itm}>
							<p>name : {itm.name}</p>
							<p>email : {itm.email}</p>
							</div>
					)
				})}
				</Card> : null}
			</Form>
		</>
	)
}

export default CustomForm
