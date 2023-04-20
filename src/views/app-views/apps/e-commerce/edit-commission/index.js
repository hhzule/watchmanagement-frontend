import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message, Card } from 'antd';
import Flex from 'components/shared-components/Flex'
import CommissionField from './CommissionField';
const EditCommission = props => {

	const auth = localStorage.getItem("auth_token")
	const [form] = Form.useForm();
	const [submitLoading, setSubmitLoading] = useState(false)

	const onFinish = () => {
		setSubmitLoading(true)
		form.validateFields().then(values => {
			setTimeout(async() => {
				console.log("valuse", values)
				const postBody =
						{  
						   "auth": auth,
						   "commission": values.commission
						   } 
						
					try {
                
							const requestOptions = {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(postBody)
						};
						console.log(requestOptions)
					
					
							await fetch(`/api/adjustcommission`, requestOptions )
							.then(response =>  response.json())
							.then(data => console.log("add result ==>" ,data));
							setSubmitLoading(false)
						message.success(`Updated commission`, [3]);
						// navigate(`/app/apps/ecommerce/${userApi}-list`)
					} catch (error) {
						console.log(error)
						// message.success(`Created ${error.message} `);
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
							<h2 className="mb-3">{`Edit`} </h2>
							<div className="mb-3">
								{/* <Button className="mr-2">Discard</Button> */}
								<Button type="primary" onClick={() => onFinish()} htmlType="submit" loading={submitLoading} >
									{ `Save`}
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
								children: <CommissionField /> ,
							},
						]}
					/>
				</div>
			</Form>
		</>
	)
}
export default EditCommission


